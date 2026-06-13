#!/usr/bin/env bash
# .claude/hooks/verify.sh
#
# Stop hook — runs machine-checkable invariants and blocks Claude from ending
# its turn (exit 2) if any invariant fails.
#
# ARMED ONLY when .claude/.verify-active exists.
#   arm  : touch .claude/.verify-active
#   disarm: rm   .claude/.verify-active
#
# Called by the Stop hook in .claude/settings.json.
# The harness pipes hook JSON on stdin; we don't need it, but we drain it
# to avoid a broken-pipe signal.
cat >/dev/null  # drain stdin

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MARKER="$REPO_DIR/.claude/.verify-active"

# No-op when disarmed — never nag during normal editing.
if [[ ! -f "$MARKER" ]]; then
  exit 0
fi

cd "$REPO_DIR" || { echo "ERROR: cannot cd to $REPO_DIR" >&2; exit 2; }

FAILED=0
MESSAGES=()

# ── Gate 1: no static waits ────────────────────────────────────────────────
PAUSES=$(grep -rnE '\.pause\(|browser\.pause\(|driver\.pause\(' tests config 2>/dev/null)
if [[ -n "$PAUSES" ]]; then
  MESSAGES+=("STATIC WAIT found — remove .pause() calls before finishing:")
  MESSAGES+=("$PAUSES")
  FAILED=1
fi

# ── Gate 2: TypeScript compiles ────────────────────────────────────────────
TS_OUT=$(npx tsc --noEmit 2>&1)
TS_EXIT=$?
if [[ $TS_EXIT -ne 0 ]]; then
  MESSAGES+=("TYPECHECK FAILED — fix tsc errors before finishing:")
  MESSAGES+=("$TS_OUT")
  FAILED=1
fi

# ── Gate 3: ESLint passes ──────────────────────────────────────────────────
LINT_OUT=$(npm run lint --silent 2>&1)
LINT_EXIT=$?
if [[ $LINT_EXIT -ne 0 ]]; then
  MESSAGES+=("LINT FAILED — fix eslint errors before finishing:")
  MESSAGES+=("$LINT_OUT")
  FAILED=1
fi

# ── Advisory only: XPath in screen objects (warns but does not block) ──────
# Match only actual XPath selector strings: ('// or ("// — not plain code comments.
XPATHS=$(grep -rn "[\'\"]\/\/" tests/screenobjects 2>/dev/null | head -10)
if [[ -n "$XPATHS" ]]; then
  echo "⚠  XPath selectors present in screenobjects (advisory — checklist item A; does not block):" >&2
  echo "$XPATHS" >&2
fi

# ── Result ─────────────────────────────────────────────────────────────────
if [[ $FAILED -ne 0 ]]; then
  echo "" >&2
  echo "═══════════════════════════════════════════════════════════" >&2
  echo "  verify.sh BLOCKED — do not stop until these are fixed:  " >&2
  echo "═══════════════════════════════════════════════════════════" >&2
  for msg in "${MESSAGES[@]}"; do
    echo "$msg" >&2
  done
  echo "" >&2
  # exit 2 = block the Stop hook; Claude keeps working and sees the reason
  exit 2
fi

echo "✓ verify.sh passed — tsc, lint, and no-pause gates all green." >&2
exit 0
