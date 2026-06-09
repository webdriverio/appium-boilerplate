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

import pytest
from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

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
    evaluation_params=[LLMTestCaseParams.INPUT, LLMTestCaseParams.ACTUAL_OUTPUT],
    model=text_judge,
    threshold=0.70,
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
    evaluation_params=[LLMTestCaseParams.INPUT, LLMTestCaseParams.ACTUAL_OUTPUT],
    model=text_judge,
    threshold=0.70,
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
    evaluation_params=[LLMTestCaseParams.INPUT, LLMTestCaseParams.ACTUAL_OUTPUT],
    model=text_judge,
    threshold=0.70,
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
        """driver.pause() is forbidden — it's a hard sleep."""
        violations = []
        for spec in SPEC_FILES:
            content = read_file(spec)
            for i, line in enumerate(content.splitlines(), 1):
                if "driver.pause(" in line and not line.strip().startswith("//"):
                    violations.append(f"{spec.name}:{i}: {line.strip()}")
        assert not violations, (
            "driver.pause() found — replace with waitForDisplayed:\n"
            + "\n".join(violations)
        )

    def test_no_driver_pause_in_screen_objects(self):
        """driver.pause() is forbidden in screen objects too."""
        violations = []
        for screen in SCREEN_OBJECTS:
            content = read_file(screen)
            for i, line in enumerate(content.splitlines(), 1):
                if "driver.pause(" in line and not line.strip().startswith("//"):
                    violations.append(f"{screen.name}:{i}: {line.strip()}")
        assert not violations, (
            "driver.pause() found in screen objects:\n" + "\n".join(violations)
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
        """Each screen object should define a SELECTORS constant."""
        missing = []
        for screen in SCREEN_OBJECTS:
            content = read_file(screen)
            # Skip component files and AppScreen base
            if screen.name in ("AppScreen.ts",):
                continue
            if "SELECTORS" not in content and "SELECTOR" not in content:
                missing.append(screen.name)
        assert not missing, (
            "Screen objects missing SELECTORS constant:\n" + "\n".join(missing)
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
        content = files_content(SCREEN_OBJECTS)
        test_case = LLMTestCase(
            input="Review the Appium screen object files for POM structure quality.",
            actual_output=content,
        )
        assert_test(test_case, [pom_structure_metric])
