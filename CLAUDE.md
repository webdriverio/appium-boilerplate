## Project Context

Appium 2.x + WebDriverIO 9.x mobile test boilerplate. TypeScript, Mocha.
Tests cover: login, biometrics, forms, swipe, drag/drop, webview, tab bar, deep links.

### Devices
| Platform | Device | UDID / Serial | Config |
|----------|--------|---------------|--------|
| Android  | Pixel_9_P1 | emulator-5558 | `config/wdio.android.app.conf.ts` |
| Android  | Pixel_9_P2 | emulator-5560 | `config/wdio.android.app2.conf.ts` |
| iOS      | Appium_Test_iPhone (iOS 26.4.1) | DA4738CD-5409-4F15-B6DB-3A5EC116AA79 | `config/wdio.ios.app.conf.ts` |
| iOS      | iPhone 17 Simulator (iOS 26.5) | 74B54CD8-219B-48B1-A483-4BAFD13C9A17 | `config/wdio.ios.app2.conf.ts` |

### Start devices
```bash
bash scripts/start-emulators.sh all       # all 4 devices
bash scripts/start-emulators.sh android   # both Android emulators only
bash scripts/start-emulators.sh ios       # both iOS simulators only
```

### Run tests
```bash
npm run android.app    # Pixel_9_P1
npm run android.app2   # Pixel_9_P2
npm run ios.app        # Appium_Test_iPhone
npm run ios.app2       # iPhone 17 Simulator
```

### Claude Code Agents (`.claude/agents/`)
Invoke with `/agent-name` in the Claude Code prompt:

| Agent | Invocation | Purpose |
|-------|-----------|---------|
| run-android-tests | `/run-android-tests` | Start emulators, run Android suite on both devices |
| run-ios-tests | `/run-ios-tests` | Boot simulators, run iOS suite on both devices |
| investigate-failure | `/investigate-failure` | Read logs + screenshots, diagnose, auto-fix, create `fix/auto-*` branch |
| eval-test-quality | `/eval-test-quality` | DeepEval + Ollama quality scoring (qwen3:14b + qwen2.5vl:7b) |
| checklist-review | `/checklist-review` | Static review of all tests against Appium checklist |
| code-refactor | `/code-refactor` | Line-level best-practice fixes (waits, locators, POM, DRY) — run after checklist-review |
| structural-refactor | `/structural-refactor` | Architecture-level refactors (base classes, capability factory, timeout centralisation) |
| update-dependencies | `/update-dependencies` | Bump devDependencies to latest, keep @wdio/* aligned, verify tsc + lint, roll back breakage |
| sync-upstream | `/sync-upstream` | Fetch + merge from webdriverio/appium-boilerplate upstream |
| overhaul-orchestrator | `/overhaul-orchestrator` | **Full 3-phase autonomous overhaul** — upstream sync → code quality → test run+fix. Arm gate first: `touch .claude/.verify-active`. One command, walk away. |
| verify-plan | `/verify-plan <checklist>` | Adversarial fresh-context reviewer — reports each checklist item as PASS/FAIL/ALREADY-SATISFIED with proof. Used by overhaul-orchestrator; also invokable manually. |

### Eval harness
```bash
cd eval && pip install -r requirements.txt
python3 -m pytest test_quality_eval.py -v              # full eval
python3 -m pytest test_quality_eval.py -v -k "locator" # locator evals only
python3 flakiness_detector.py tests/specs/app.forms.spec.ts --runs 3 --platform android
```

### investigate-failure branch convention
Auto-fixes are committed to `fix/auto-<YYYYMMDD-HHMMSS>` branches — never directly to `main`.

---

## Development Workflow

### Your Responsibilities

**Code Development:**

- Provide well-architected, robust, and thoroughly tested solutions
- Every code solution must include appropriate unit tests
- Follow KISS and YAGNI principles
- Write clean, self-documenting,SOLID, BigO efficient code
- Add comments only for complex logic
- Use existing frameworks; suggest new ones only with explicit validation
- **NEVER create files unless absolutely necessary**
- **ALWAYS prefer editing existing files to creating new ones**

**Architectural Guidance:**

- Consider scalability, maintainability, and performance

**Quality Assurance:**

- Validate solutions integrate with existing systems
- Follow established error handling patterns
- Ensure logging aligns with current practices
- Address security considerations (avoid credential leaks, SQL injection, XSS)

### Work Process

1. **Before implementing**, present your plan and explain the proposed solution
2. **Wait for developer validation** before proceeding
3. **Ensure all solutions include comprehensive unit tests**
4. **Verify alignment** with existing codebase patterns
5. **Be proactive** in identifying potential issues

### Communication Style

- Be helpful but proactive in suggesting better approaches
- Explain reasoning behind decisions
- Ask clarifying questions for ambiguous requirements
- Use concrete examples from the codebase
- Balance thoroughness with practicality

## Git Workflow Guardrails

### ❌ DO NOT

- **DO NOT run git commands** that modify history (rebase, reset, etc.) without explicit request

### ✅ DO

- **DO read git status** to understand current changes
- **DO use git log** to understand commit history and patterns
- **DO use git diff** to see what has changed
- **DO inform the developer** when changes are ready to be committed

---

## Verification Contract

> These rules are enforced by `.claude/hooks/verify.sh` (Stop hook) and `/verify-plan` (adversarial subagent). They are NOT advisory — follow them for every phase of work.

1. **Evidence over assertion.** Every "done" must paste the exact command run and its output. Do not say "tsc passes" — paste `npx tsc --noEmit` output. If it passes cleanly, the output is empty; paste that emptiness.

2. **"Already satisfied" is a valid result.** If an invariant was already true before this change, say "already satisfied — invariant held before this session" and show the grep/check output that proves it. Do NOT fabricate work.

3. **Phase gate before declaring complete.** Before ending any phase:
   - Run `npx tsc --noEmit` and `npm run lint` — paste both outputs.
   - Run `grep -rnE '\.pause\(|browser\.pause\(' tests config` — paste result (must be empty).
   - Invoke `/verify-plan` with the phase checklist and paste its PASS/FAIL/ALREADY-SATISFIED table.
   - The Stop hook (`verify.sh`) enforces tsc, lint, and no-pause automatically when `.claude/.verify-active` is armed.

4. **One phase per session.** Run `/clear` between phases. Context accumulation buries checklist rules.

5. **Arm/disarm the Stop hook.** At the start of an overhaul run: `touch .claude/.verify-active`. After all phases pass and work is committed: `rm .claude/.verify-active`.
