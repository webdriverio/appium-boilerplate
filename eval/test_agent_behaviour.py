"""
Behavioural agent harness — invokes the code-refactor and update-dependencies
agents on fixture files and asserts the output meets quality criteria via
deterministic checks AND an Ollama LLM judge.

This harness tests that the AGENTS (not just static code) actually fix the
planted problems.  Because it invokes the claude CLI it is:
  - Slow (can take 2–5 min per test)
  - Opt-in: skipped unless RUN_AGENT_EVALS=1 AND the `claude` CLI is in PATH

Run:
    RUN_AGENT_EVALS=1 cd eval && python3 -m pytest test_agent_behaviour.py -v --tb=short

Skip gracefully if CLI absent:
    cd eval && python3 -m pytest test_agent_behaviour.py -v
    # → all tests skip with a clear message
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
from pathlib import Path

import pytest
from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, SingleTurnParams

from ollama_judge import OllamaJudge

# Raise deepeval timeout — qwen3:14b can take 5–8 min on a large input
os.environ.setdefault("DEEPEVAL_PER_TASK_TIMEOUT_SECONDS_OVERRIDE", "900")

PROJECT_ROOT = Path(__file__).parent.parent

# ── Skip conditions ────────────────────────────────────────────────────────────

RUN_AGENT_EVALS = os.getenv("RUN_AGENT_EVALS", "0") == "1"
CLAUDE_CLI_PRESENT = shutil.which("claude") is not None

skip_unless_enabled = pytest.mark.skipif(
    not RUN_AGENT_EVALS,
    reason=(
        "Set RUN_AGENT_EVALS=1 to run behavioural agent tests "
        "(slow — requires claude CLI + Ollama)"
    ),
)
skip_unless_claude = pytest.mark.skipif(
    not CLAUDE_CLI_PRESENT,
    reason="'claude' CLI not found in PATH — install Claude Code CLI to run agent tests",
)

# ── Fixture screen object with planted anti-patterns ─────────────────────────
#
# Each anti-pattern is labelled so deterministic assertions can target it.
# Do NOT use this file as a real screen-object reference.

FIXTURE_SCREEN_OBJECT = """\
import AppScreen from './AppScreen.js';

// Deliberately anti-pattern fixture for agent behavioural testing.
// Anti-patterns planted:
//   1. getter uses `await $()` — stale element reference
//   2. inline XPath selector instead of UiAutomator2 / ClassChain
//   3. driver.pause() hard sleep
//   4. god-method (30+ lines) that must be split

const SELECTORS = {
    SCREEN: '~Bad-screen',
    SUBMIT_BTN: '~submit-button',
};

class BadScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SCREEN);
    }

    // Anti-pattern 1: getter uses await $() → holds stale element reference
    get submitButton() { return await $(SELECTORS.SUBMIT_BTN); }

    // Anti-pattern 2: XPath locator when UiAutomator2 / ClassChain is available
    get badLocator() { return $('//android.widget.Button[@text="Submit"]'); }

    // Anti-pattern 3: driver.pause hard sleep
    async doSomething() {
        await driver.pause(2000);
        await (await this.submitButton).click();
    }

    // Anti-pattern 4: god-method — far exceeds the 15-line limit
    async bigGodMethod(value: string) {
        const el1 = await $('~field-1');
        await el1.waitForDisplayed();
        await el1.setValue(value);
        const el2 = await $('~field-2');
        await el2.waitForDisplayed();
        await el2.setValue(value);
        const el3 = await $('~field-3');
        await el3.waitForDisplayed();
        await el3.click();
        const el4 = await $('~field-4');
        await el4.waitForDisplayed();
        await el4.click();
        const el5 = await $('~field-5');
        await el5.waitForDisplayed();
        await el5.click();
        await driver.pause(500);
        await (await this.submitButton).click();
    }
}

export default new BadScreen();
"""

# ── LLM judge (reuses Ollama / GEval plumbing from test_quality_eval.py) ─────

text_judge = OllamaJudge(model="qwen3:14b", temperature=0.0)

refactored_quality_metric = GEval(
    name="Refactored Code Quality",
    criteria="""
        Evaluate whether the TypeScript Appium screen object has been properly refactored
        from an anti-pattern state to meet WDIO/Appium best practices.

        PASS conditions (score towards 1.0):
        - No driver.pause() calls remain (or any present are preceded by a justifying comment)
        - Getters return $(SELECTOR) without await — element re-queried fresh on each access
        - No XPath (//) used where UiAutomator2 ('android=...') or ClassChain ('-ios class chain')
          would be more appropriate
        - Long methods are split into small, named private helpers (≤ 15 lines each)
        - All selectors are defined in a SELECTORS constant at the top of the file

        FAIL conditions (score towards 0.0):
        - driver.pause() calls still present as live code (not commented out)
        - Getters still use await $() — stale element reference anti-pattern
        - XPath still used as the primary locator strategy
        - God-method (> 15 lines) still present without being split
    """,
    evaluation_params=[SingleTurnParams.INPUT, SingleTurnParams.ACTUAL_OUTPUT],
    model=text_judge,
    threshold=0.65,
)


# ── Agent invocation helpers ──────────────────────────────────────────────────

def run_headless_claude(prompt: str, timeout: int = 300) -> str:
    """Run `claude -p` (print mode) with the permissions the agents need.

    Headless mode denies tool calls silently unless granted, so file edits and
    the read-only npm/tsc lookups the agents rely on are allowlisted explicitly.
    The fixture files live in pytest tmp dirs outside the repo — `--add-dir`
    makes them editable.
    """
    result = subprocess.run(
        [
            "claude", "-p", prompt,
            "--permission-mode", "acceptEdits",
            "--add-dir", "/private/tmp", "--add-dir", "/tmp",
            "--allowedTools", "Edit,Write,Read,Bash(npm view:*),Bash(npx tsc:*)",
        ],
        cwd=str(PROJECT_ROOT),
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"claude CLI exited with code {result.returncode}.\n"
            f"stdout: {result.stdout[-2000:]}\nstderr: {result.stderr[-2000:]}"
        )
    return result.stdout


def invoke_code_refactor_agent(target_file: Path, timeout: int = 300) -> None:
    """Run the code-refactor Claude Code agent against *target_file*."""
    run_headless_claude(
        f"Refactor the file at {target_file} to meet WDIO/Appium best practices. "
        "Fix: driver.pause() → waitForDisplayed/waitUntil, "
        "remove await from getters, replace XPath with UiAutomator2/ClassChain, "
        "split god-methods > 15 lines into private helpers. "
        "Verify tsc --noEmit passes after. Report what was changed.",
        timeout=timeout,
    )


# ── Fixtures ─────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def refactored_screen_object(tmp_path_factory):
    """Write the fixture to a temp dir, invoke the agent once per module, return path."""
    tmp = tmp_path_factory.mktemp("agent_fixture")
    fixture_path = tmp / "BadScreen.ts"
    fixture_path.write_text(FIXTURE_SCREEN_OBJECT, encoding="utf-8")
    invoke_code_refactor_agent(fixture_path)
    return fixture_path


# ── Deterministic post-condition tests ───────────────────────────────────────

@pytest.mark.agent
class TestCodeRefactorAgentBehaviour:
    """End-to-end behavioural tests for the code-refactor agent.

    Invoked once per module via the shared `refactored_screen_object` fixture.
    All tests in this class are skipped unless RUN_AGENT_EVALS=1 and `claude` CLI
    is available.
    """

    @skip_unless_enabled
    @skip_unless_claude
    def test_agent_removes_driver_pause(self, refactored_screen_object):
        """The code-refactor agent must eliminate undocumented driver.pause() calls."""
        refactored = refactored_screen_object.read_text(encoding="utf-8")
        live_pauses = [
            line.strip()
            for line in refactored.splitlines()
            if "driver.pause(" in line and not line.strip().startswith("//")
        ]
        assert not live_pauses, (
            "code-refactor agent left undocumented driver.pause() calls:\n"
            + "\n".join(live_pauses)
        )

    @skip_unless_enabled
    @skip_unless_claude
    def test_agent_removes_await_in_getters(self, refactored_screen_object):
        """The code-refactor agent must remove `await` from getter return expressions."""
        refactored = refactored_screen_object.read_text(encoding="utf-8")
        await_getter_re = re.compile(r"\bget\b.+\{.*await\s+\$\(")
        violations = [
            line.strip()
            for line in refactored.splitlines()
            if await_getter_re.search(line) and not line.strip().startswith("//")
        ]
        assert not violations, (
            "code-refactor agent left `await $()` in getters:\n"
            + "\n".join(violations)
        )

    @skip_unless_enabled
    @skip_unless_claude
    def test_agent_splits_god_method(self, refactored_screen_object):
        """The code-refactor agent must split the 30-line god-method into ≤15-line helpers."""
        refactored = refactored_screen_object.read_text(encoding="utf-8")
        _keywords = {"if", "for", "while", "switch", "catch", "constructor"}
        method_re = re.compile(
            r"^\s+(?:(?:private|public|protected|override|static|async)\s+)*(\w+)\s*\("
        )
        violations: list[str] = []
        lines = refactored.splitlines()
        method_start: int | None = None
        depth = 0
        method_name = ""
        for i, line in enumerate(lines, 1):
            m = method_re.match(line)
            if m and "{" in line and m.group(1) not in _keywords:
                method_start = i
                method_name = m.group(1)
                depth = line.count("{") - line.count("}")
            elif method_start is not None:
                depth += line.count("{") - line.count("}")
                if depth <= 0:
                    length = i - method_start + 1
                    if length > 15:
                        violations.append(f"`{method_name}` is {length} lines (max 15)")
                    method_start = None
        assert not violations, (
            "code-refactor agent did not split the god-method into ≤15-line helpers:\n"
            + "\n".join(violations)
        )

    @skip_unless_enabled
    @skip_unless_claude
    def test_agent_output_quality_llm_judge(self, refactored_screen_object):
        """The refactored output must score ≥ 0.65 on the Ollama LLM quality judge."""
        refactored = refactored_screen_object.read_text(encoding="utf-8")
        test_case = LLMTestCase(
            input="Evaluate the refactored Appium screen object for WDIO/Appium best-practice quality.",
            actual_output=refactored,
        )
        assert_test(test_case, [refactored_quality_metric])


# ── update-dependencies agent ─────────────────────────────────────────────────
#
# Fixture package.json with deliberately stale pins.  The agent must bump each
# devDependency to ^<latest> and keep the @wdio/* family on ONE version.
# Assertions are version-agnostic (planted < result) so they don't rot as new
# releases ship.

FIXTURE_PACKAGE_JSON = """\
{
    "name": "dep-update-fixture",
    "version": "0.0.1",
    "devDependencies": {
        "@wdio/cli": "^9.0.0",
        "@wdio/globals": "^9.2.0",
        "@wdio/local-runner": "^9.0.0",
        "appium-uiautomator2-driver": "^7.0.0",
        "typescript": "^5.0.0"
    }
}
"""

PLANTED_VERSIONS = {
    "@wdio/cli": "9.0.0",
    "@wdio/globals": "9.2.0",
    "@wdio/local-runner": "9.0.0",
    "appium-uiautomator2-driver": "7.0.0",
    "typescript": "5.0.0",
}


def _semver_tuple(version: str) -> tuple[int, ...]:
    """'^9.28.0' → (9, 28, 0).  Pre-release suffixes are stripped."""
    cleaned = version.lstrip("^~=v").split("-")[0]
    return tuple(int(part) for part in cleaned.split(".") if part.isdigit())


def invoke_update_dependencies_agent(target_file: Path, timeout: int = 300) -> None:
    """Run the update-dependencies agent rules against a fixture package.json.

    `npm install` is excluded on purpose — the eval asserts on the version
    bumps the agent writes, not on registry side effects.
    """
    run_headless_claude(
        f"Act as the update-dependencies agent (.claude/agents/update-dependencies.md) "
        f"on the fixture file {target_file} ONLY. "
        "For each devDependency, look up the latest published version with "
        "`npm view <pkg> version` and rewrite the entry as ^<latest>. "
        "All @wdio/* packages must end up on the exact same version. "
        "Edit only that file — do NOT run npm install and do NOT touch the real project. "
        "Report each package as before → after.",
        timeout=timeout,
    )


@pytest.fixture(scope="module")
def updated_package_json(tmp_path_factory):
    """Write the stale fixture, invoke the agent once per module, return path."""
    tmp = tmp_path_factory.mktemp("dep_fixture")
    fixture_path = tmp / "package.json"
    fixture_path.write_text(FIXTURE_PACKAGE_JSON, encoding="utf-8")
    invoke_update_dependencies_agent(fixture_path)
    return fixture_path


@pytest.mark.agent
class TestUpdateDependenciesAgentBehaviour:
    """End-to-end behavioural tests for the update-dependencies agent."""

    @skip_unless_enabled
    @skip_unless_claude
    def test_agent_output_is_valid_json(self, updated_package_json):
        """The agent must leave package.json parseable with devDependencies intact."""
        import json

        data = json.loads(updated_package_json.read_text(encoding="utf-8"))
        missing = set(PLANTED_VERSIONS) - set(data.get("devDependencies", {}))
        assert not missing, f"agent dropped devDependencies: {sorted(missing)}"

    @skip_unless_enabled
    @skip_unless_claude
    def test_agent_bumps_every_stale_pin(self, updated_package_json):
        """Every planted-stale version must be strictly newer afterwards."""
        import json

        deps = json.loads(updated_package_json.read_text(encoding="utf-8"))["devDependencies"]
        stale = [
            f"{pkg}: {planted} → {deps[pkg]}"
            for pkg, planted in PLANTED_VERSIONS.items()
            if _semver_tuple(deps[pkg]) <= _semver_tuple(planted)
        ]
        assert not stale, "update-dependencies agent left stale pins:\n" + "\n".join(stale)

    @skip_unless_enabled
    @skip_unless_claude
    def test_agent_keeps_wdio_family_aligned(self, updated_package_json):
        """All @wdio/* packages must land on one identical version."""
        import json

        deps = json.loads(updated_package_json.read_text(encoding="utf-8"))["devDependencies"]
        wdio_versions = {pkg: v for pkg, v in deps.items() if pkg.startswith("@wdio/")}
        assert len(set(wdio_versions.values())) == 1, (
            f"@wdio/* packages diverged after update: {wdio_versions}"
        )
