"""
Test quality evaluation for the appium-boilerplate test suite.

Evaluates: locator strategy, wait strategy, POM structure, accessibility ID coverage.
Judge models: qwen3:14b (code/text criteria), qwen2.5vl:7b (screenshots).

Run:
    cd eval && python3 -m pytest test_quality_eval.py -v
    cd eval && python3 -m pytest test_quality_eval.py -v -k "locator"
"""
from __future__ import annotations

import glob
import os
import re
from pathlib import Path

# qwen3:14b running locally can take 5–8 min per eval on a large input.
# Raise deepeval's per-task timeout above the default 207 s so tests don't
# time out before the model finishes.
os.environ.setdefault("DEEPEVAL_PER_TASK_TIMEOUT_SECONDS_OVERRIDE", "900")

import pytest
from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, SingleTurnParams

from ollama_judge import OllamaJudge

# ── Paths ─────────────────────────────────────────────────────────────────────

PROJECT_ROOT = Path(__file__).parent.parent
SCREEN_OBJECTS = sorted((PROJECT_ROOT / "tests/screenobjects").glob("**/*.ts"))
SPEC_FILES = sorted((PROJECT_ROOT / "tests/specs").glob("app*.spec.ts"))
HELPER_FILES = sorted((PROJECT_ROOT / "tests/helpers").glob("*.ts"))

# ── Judge models ──────────────────────────────────────────────────────────────

text_judge = OllamaJudge(model="qwen3:14b", temperature=0.0)
vision_judge = OllamaJudge(model="qwen2.5vl:7b", temperature=0.0)

# ── Metrics ───────────────────────────────────────────────────────────────────

locator_metric = GEval(
    name="Locator Strategy Quality",
    criteria="""
        Evaluate the TypeScript code for Appium locator strategy quality.

        PASS conditions (score towards 1.0):
        - Uses accessibility ID selectors (~'identifier') as the primary choice
        - Uses UiAutomator2 ('android=new UiSelector()...') for Android-specific selectors
        - Uses iOS Class Chain ('-ios class chain:') or Predicate String ('-ios predicate string:')
          for iOS-specific selectors
        - Selectors are defined in a SELECTORS constant object, not scattered inline
        - No raw class name selectors like $('android.widget.Button')

        FAIL conditions (score towards 0.0):
        - XPath selectors (//) used as the primary strategy (not as a last resort)
        - Hardcoded coordinate taps instead of element-based interactions
        - Selectors defined inline in methods rather than in a constants object
        - Missing accessibility ID when it could reasonably be used
    """,
    evaluation_params=[SingleTurnParams.INPUT, SingleTurnParams.ACTUAL_OUTPUT],
    model=text_judge,
    threshold=0.50,
)

wait_strategy_metric = GEval(
    name="Wait Strategy Quality",
    criteria="""
        Evaluate the TypeScript code for Appium wait strategy quality.

        PASS conditions (score towards 1.0):
        - Uses waitForDisplayed({ timeout, timeoutMsg }) with a meaningful timeoutMsg string
        - Uses waitForEnabled() before clicking elements that become enabled asynchronously
        - Uses driver.waitUntil() for custom polling conditions
        - Uses waitForIsShown() before interacting with a screen

        FAIL conditions (score towards 0.0):
        - Contains driver.pause(milliseconds) — this is a hard sleep and is always wrong
        - waitForDisplayed() called without a timeoutMsg (message is empty or missing)
        - Polling with a setTimeout/setInterval loop instead of driver.waitUntil()
        - No waits before interacting with elements that may load asynchronously
    """,
    evaluation_params=[SingleTurnParams.INPUT, SingleTurnParams.ACTUAL_OUTPUT],
    model=text_judge,
    threshold=0.50,
)

pom_structure_metric = GEval(
    name="Page Object Model Structure",
    criteria="""
        Evaluate the TypeScript screen object class for Page Object Model quality.

        PASS conditions (score towards 1.0):
        - Class extends AppScreen (or BaseScreen)
        - Getters return $(SELECTOR) without await — element re-queried fresh on each access
        - All selectors defined in a SELECTORS constant at the top of the file
        - Actions are methods on the class; spec files never call $() directly
        - Shared UI components (TabBar, NativeAlert) are separate imported classes

        FAIL conditions (score towards 0.0):
        - Getters use await $(SELECTOR) — holds a stale element reference
        - Selectors hardcoded inline in methods
        - Spec file imports and calls $() directly instead of going through screen object
        - Duplicate selector definitions copied from another screen object
    """,
    evaluation_params=[SingleTurnParams.INPUT, SingleTurnParams.ACTUAL_OUTPUT],
    model=text_judge,
    threshold=0.50,
)

# ── Helpers ───────────────────────────────────────────────────────────────────

def read_file(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def files_content(file_list: list[Path]) -> str:
    return "\n\n".join(
        f"// === {p.name} ===\n{read_file(p)}" for p in file_list
    )


# ── Deterministic checks (no LLM judge) ───────────────────────────────────────

class TestDeterministicChecks:
    """Fast deterministic checks — no Ollama required."""

    def test_no_driver_pause_in_specs(self):
        """driver.pause() is forbidden unless preceded by a comment documenting why it's unavoidable."""
        violations = []
        for spec in SPEC_FILES:
            content = read_file(spec)
            lines = content.splitlines()
            for i, line in enumerate(lines, 1):
                if "driver.pause(" in line and not line.strip().startswith("//"):
                    # Allow if the preceding non-blank line contains a justifying comment
                    prev = lines[i - 2].strip() if i >= 2 else ""
                    if prev.startswith("//"):
                        continue  # documented exception — skip
                    violations.append(f"{spec.name}:{i}: {line.strip()}")
        assert not violations, (
            "Undocumented driver.pause() found — replace with waitForDisplayed/waitUntil, "
            "or add a comment explaining why it is unavoidable:\n"
            + "\n".join(violations)
        )

    def test_no_driver_pause_in_screen_objects(self):
        """driver.pause() is forbidden in screen objects."""
        violations = []
        for screen in SCREEN_OBJECTS:
            content = read_file(screen)
            lines = content.splitlines()
            for i, line in enumerate(lines, 1):
                if "driver.pause(" in line and not line.strip().startswith("//"):
                    prev = lines[i - 2].strip() if i >= 2 else ""
                    if prev.startswith("//"):
                        continue
                    violations.append(f"{screen.name}:{i}: {line.strip()}")
        assert not violations, (
            "Undocumented driver.pause() found in screen objects:\n" + "\n".join(violations)
        )

    def test_accessibility_id_coverage(self):
        """At least 70% of selectors in screen objects should use accessibility ID (~)."""
        all_selectors: list[str] = []
        accessibility_id_selectors: list[str] = []

        for screen in SCREEN_OBJECTS:
            content = read_file(screen)
            # Find all selector strings
            matches = re.findall(r'\$\([\'"`](.+?)[\'"`]\)', content)
            all_selectors.extend(matches)
            accessibility_id_selectors.extend(m for m in matches if m.startswith("~"))

        if not all_selectors:
            pytest.skip("No selectors found in screen objects")

        coverage = len(accessibility_id_selectors) / len(all_selectors)
        assert coverage >= 0.70, (
            f"Accessibility ID coverage is {coverage:.0%} "
            f"({len(accessibility_id_selectors)}/{len(all_selectors)}) — target is 70%.\n"
            f"Non-accessibility-ID selectors: "
            + str([s for s in all_selectors if not s.startswith("~")])
        )

    def test_selectors_in_constants(self):
        """Screen objects that define $() selectors should group them in a SELECTORS constant."""
        missing = []
        for screen in SCREEN_OBJECTS:
            content = read_file(screen)
            # Skip base class and platform utilities that use dynamic/text-based selectors
            if screen.name in ("AppScreen.ts", "AndroidSettings.ts"):
                continue
            has_dollar_selectors = bool(re.search(r'\$\([\'"`]', content))
            if not has_dollar_selectors:
                continue  # no selectors to extract — nothing to check
            if "SELECTORS" not in content and "SELECTOR" not in content:
                missing.append(screen.name)
        assert not missing, (
            "Screen objects with inline selectors but no SELECTORS constant:\n"
            + "\n".join(missing)
        )

    def test_no_xpath_primary_strategy(self):
        """XPath (//) should only be a last resort — flag any usage as a warning."""
        xpath_usages = []
        for screen in SCREEN_OBJECTS:
            content = read_file(screen)
            for i, line in enumerate(content.splitlines(), 1):
                if re.search(r'\$\([\'"`]//', line) and not line.strip().startswith("//"):
                    xpath_usages.append(f"{screen.name}:{i}: {line.strip()}")
        # Info-level: log but don't fail (XPath may be legitimately needed)
        if xpath_usages:
            print("\n[INFO] XPath selectors found (consider replacing with Class Chain or UiAutomator2):")
            for usage in xpath_usages:
                print(f"  {usage}")


# ── LLM-judged evals ──────────────────────────────────────────────────────────

class TestLocatorStrategy:
    """Evaluate locator strategy quality using qwen3:14b."""

    def test_screen_objects_locator_strategy(self):
        content = files_content(SCREEN_OBJECTS)
        test_case = LLMTestCase(
            input="Review the Appium screen object files for locator strategy quality.",
            actual_output=content,
        )
        assert_test(test_case, [locator_metric])


class TestWaitStrategy:
    """Evaluate wait strategy quality using qwen3:14b."""

    def test_specs_wait_strategy(self):
        content = files_content(SPEC_FILES)
        test_case = LLMTestCase(
            input="Review the Appium spec files for wait strategy quality.",
            actual_output=content,
        )
        assert_test(test_case, [wait_strategy_metric])

    def test_screen_objects_wait_strategy(self):
        content = files_content(SCREEN_OBJECTS)
        test_case = LLMTestCase(
            input="Review the Appium screen object files for wait strategy quality.",
            actual_output=content,
        )
        assert_test(test_case, [wait_strategy_metric])


class TestPOMStructure:
    """Evaluate Page Object Model structure using qwen3:14b."""

    def test_screen_objects_pom_structure(self):
        # Exclude utilities and components that intentionally don't extend AppScreen:
        # - AndroidSettings.ts: ADB/platform utility with dynamic UiAutomator2 selectors
        # - WebviewScreen.ts: extends WebView helper class (context-switching utility), not AppScreen
        # - components/*: Carousel, NativeAlert, Picker, TabBar are shared UI components (static classes)
        excluded = {"AndroidSettings.ts", "WebviewScreen.ts", "Carousel.ts", "NativeAlert.ts", "Picker.ts", "TabBar.ts"}
        pom_files = [f for f in SCREEN_OBJECTS if f.name not in excluded]
        content = files_content(pom_files)
        test_case = LLMTestCase(
            input="Review the Appium screen object files for POM structure quality.",
            actual_output=content,
        )
        assert_test(test_case, [pom_structure_metric])


# ── Agent output quality gates (deterministic) ────────────────────────────────

class TestAgentOutputGates:
    """Deterministic gates that verify the code-refactor and checklist-review
    agents leave the codebase in the expected state.  These run fast (no LLM)
    and act as a regression harness after any agent-driven change."""

    def test_no_method_exceeds_15_lines(self):
        """No method body in screen objects should exceed 15 lines.
        Long methods are a sign the agent introduced a god-method instead of
        splitting into smaller helpers."""
        violations = []
        # Match class method declarations only — exclude keywords (if/for/while/switch/catch)
        _keywords = {"if", "for", "while", "switch", "catch", "constructor"}
        # AndroidSettings.ts is a multi-version platform utility — legitimately complex
        _excluded = {"AndroidSettings.ts"}
        method_re = re.compile(r"^\s+(?:(?:private|public|protected|override|static|async)\s+)*(\w+)\s*\(")
        for screen in (s for s in SCREEN_OBJECTS if s.name not in _excluded):
            lines = read_file(screen).splitlines()
            method_start = None
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
                            violations.append(
                                f"{screen.name}: `{method_name}` is {length} lines (max 15)"
                            )
                        method_start = None
        assert not violations, (
            "Methods exceeding 15-line limit (split into smaller helpers):\n"
            + "\n".join(violations)
        )

    def test_no_raw_string_platform_check(self):
        """Platform checks must use driver.isAndroid / driver.isIOS, not string
        comparisons like platformName === 'Android'."""
        violations = []
        pattern = re.compile(r'platformName\s*[=!]=\s*[\'"]', re.IGNORECASE)
        for path in list(SCREEN_OBJECTS) + list(SPEC_FILES):
            for i, line in enumerate(read_file(path).splitlines(), 1):
                if pattern.search(line) and not line.strip().startswith("//"):
                    violations.append(f"{path.name}:{i}: {line.strip()}")
        assert not violations, (
            "Raw platformName string checks — use driver.isAndroid/driver.isIOS:\n"
            + "\n".join(violations)
        )

    def test_getters_do_not_use_await(self):
        """Getters in screen objects must NOT use `await $()`.
        `await $()` holds a stale element reference; getters should return
        `$(SELECTOR)` so the element is re-queried on each access."""
        violations = []
        pattern = re.compile(r"\bget\b.+\{.*await\s+\$\(")
        for screen in SCREEN_OBJECTS:
            for i, line in enumerate(read_file(screen).splitlines(), 1):
                if pattern.search(line) and not line.strip().startswith("//"):
                    violations.append(f"{screen.name}:{i}: {line.strip()}")
        assert not violations, (
            "Getters using `await $()` — remove the await:\n"
            + "\n".join(violations)
        )

    def test_waitForDisplayed_has_timeoutMsg(self):
        """Every waitForDisplayed call in screen objects should pass a timeoutMsg
        so failures are self-describing.  Calls without one are flagged as WARNING."""
        missing = []
        for screen in SCREEN_OBJECTS:
            content = read_file(screen)
            for i, line in enumerate(content.splitlines(), 1):
                if "waitForDisplayed(" in line and "timeoutMsg" not in line and not line.strip().startswith("//"):
                    missing.append(f"{screen.name}:{i}: {line.strip()}")
        # INFO-level: collect and print but don't hard-fail (some one-liner waitForDisplayed
        # calls are acceptable when the surrounding context already identifies the element)
        if missing:
            print(
                "\n[INFO] waitForDisplayed without timeoutMsg "
                "(add timeoutMsg for self-describing failures):"
            )
            for m in missing:
                print(f"  {m}")

    def test_agent_files_exist(self):
        """All required Claude Code agents must be present in .claude/agents/."""
        agents_dir = PROJECT_ROOT / ".claude/agents"
        required = {
            "run-android-tests.md",
            "run-ios-tests.md",
            "investigate-failure.md",
            "eval-test-quality.md",
            "checklist-review.md",
            "sync-upstream.md",
            "code-refactor.md",
        }
        missing = required - {f.name for f in agents_dir.glob("*.md")}
        assert not missing, f"Missing agent definition files: {missing}"
