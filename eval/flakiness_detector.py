"""
Flakiness detector — runs a spec file N times and reports the pass rate.

Usage:
    python3 eval/flakiness_detector.py tests/specs/app.forms.spec.ts
    python3 eval/flakiness_detector.py tests/specs/app.forms.spec.ts --runs 5 --platform ios
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
LOGS_DIR = PROJECT_ROOT / "logs"


def run_spec(spec: str, platform: str) -> tuple[bool, str]:
    """Run one spec file and return (passed, log_output)."""
    config = (
        "config/wdio.android.app.conf.ts"
        if platform == "android"
        else "config/wdio.ios.app.conf.ts"
    )
    result = subprocess.run(
        ["npx", "wdio", "run", config, "--spec", spec],
        capture_output=True,
        text=True,
        cwd=PROJECT_ROOT,
    )
    output = result.stdout + result.stderr
    passed = result.returncode == 0
    return passed, output


def extract_counts(log: str) -> dict[str, int]:
    """Parse WDIO spec reporter output for pass/fail counts."""
    passing = len(re.findall(r"passing", log, re.IGNORECASE))
    failing = len(re.findall(r"failing", log, re.IGNORECASE))
    return {"passing": passing, "failing": failing}


def main():
    parser = argparse.ArgumentParser(description="Detect flaky Appium specs")
    parser.add_argument("spec", help="Spec file path (relative to project root)")
    parser.add_argument("--runs", type=int, default=3, help="Number of runs (default: 3)")
    parser.add_argument(
        "--platform", choices=["android", "ios"], default="android"
    )
    args = parser.parse_args()

    spec = args.spec
    total = args.runs
    passed_runs = 0
    results = []

    print(f"\nFlakiness detection: {spec}")
    print(f"Platform: {args.platform} | Runs: {total}\n")

    for i in range(1, total + 1):
        print(f"Run {i}/{total}...", end=" ", flush=True)
        passed, log = run_spec(spec, args.platform)
        status = "PASS" if passed else "FAIL"
        print(status)

        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        log_path = LOGS_DIR / f"flakiness-run{i}-{timestamp}.log"
        log_path.write_text(log, encoding="utf-8")

        results.append({"run": i, "passed": passed, "log": str(log_path)})
        if passed:
            passed_runs += 1

    pass_rate = passed_runs / total
    is_flaky = pass_rate < 1.0

    print(f"\n{'─' * 50}")
    print(f"Spec:       {spec}")
    print(f"Pass rate:  {passed_runs}/{total} ({pass_rate:.0%})")
    print(f"Status:     {'FLAKY ⚠' if is_flaky else 'STABLE ✓'}")
    print(f"{'─' * 50}")

    if is_flaky:
        failing_runs = [r for r in results if not r["passed"]]
        print(f"\nFailing run logs:")
        for r in failing_runs:
            print(f"  Run {r['run']}: {r['log']}")
        print(
            "\nRecommendation: Investigate the failing logs. "
            "Common causes: tight timeouts, missing waitForIsShown(), "
            "stale element references, or unhandled system alerts."
        )
        sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
