#!/usr/bin/env bash
# Start Android emulators on fixed ports, or boot iOS simulators.
# Usage:
#   bash scripts/start-emulators.sh android   — starts Pixel_9_P1 (5558) + Pixel_9_P2 (5560)
#   bash scripts/start-emulators.sh ios       — boots Appium_Test_iPhone + iPhone 17 Simulator
#   bash scripts/start-emulators.sh all       — starts both Android and iOS

set -euo pipefail

EMULATOR="$HOME/Library/Android/sdk/emulator/emulator"
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
ANDROID_BOOT_TIMEOUT=180   # seconds
IOS_BOOT_TIMEOUT=60

log() { echo "[$(date +%H:%M:%S)] $*"; }

# ─── Android ──────────────────────────────────────────────────────────────────

start_android_emulator() {
    local avd=$1 port=$2 serial="emulator-$port"

    if "$ADB" devices | grep -q "^${serial}[[:space:]]*device$"; then
        log "$avd already running on $serial"
        return 0
    fi

    log "Starting $avd on port $port..."
    "$EMULATOR" -avd "$avd" -port "$port" -no-audio -no-snapshot-load \
        -no-boot-anim 2>/dev/null &

    local elapsed=0
    until "$ADB" devices | grep -q "^${serial}[[:space:]]*device$"; do
        sleep 5
        elapsed=$((elapsed + 5))
        if [[ $elapsed -ge $ANDROID_BOOT_TIMEOUT ]]; then
            echo "[ERROR] $avd ($serial) did not reach 'device' state within ${ANDROID_BOOT_TIMEOUT}s" >&2
            exit 1
        fi
        log "Waiting for $serial... (${elapsed}s)"
    done

    # Wait for boot to complete (sys.boot_completed property)
    "$ADB" -s "$serial" wait-for-device shell \
        'while [[ "$(getprop sys.boot_completed)" != "1" ]]; do sleep 2; done'

    log "$avd is ready on $serial"
}

start_android() {
    start_android_emulator "Pixel_9_P1" 5558 &
    start_android_emulator "Pixel_9_P2" 5560 &
    wait
    log "Both Android emulators are ready."
}

# ─── iOS ──────────────────────────────────────────────────────────────────────

boot_ios_simulator() {
    local name=$1 udid=$2

    local state
    state=$(xcrun simctl list devices | grep "$udid" | awk -F'[()]' '{print $4}')

    if [[ "$state" == "Booted" ]]; then
        log "$name ($udid) already booted"
        return 0
    fi

    log "Booting $name ($udid)..."
    xcrun simctl boot "$udid"

    local elapsed=0
    until xcrun simctl list devices | grep "$udid" | grep -q "Booted"; do
        sleep 5
        elapsed=$((elapsed + 5))
        if [[ $elapsed -ge $IOS_BOOT_TIMEOUT ]]; then
            echo "[ERROR] $name ($udid) did not boot within ${IOS_BOOT_TIMEOUT}s" >&2
            exit 1
        fi
        log "Waiting for $name... (${elapsed}s)"
    done

    log "$name is ready."
}

start_ios() {
    boot_ios_simulator "Appium_Test_iPhone"       "DA4738CD-5409-4F15-B6DB-3A5EC116AA79" &
    boot_ios_simulator "iPhone 17 Simulator"      "74B54CD8-219B-48B1-A483-4BAFD13C9A17" &
    wait
    log "Both iOS simulators are ready."
}

# ─── Entry point ──────────────────────────────────────────────────────────────

TARGET="${1:-all}"

case "$TARGET" in
    android) start_android ;;
    ios)     start_ios ;;
    all)     start_android & start_ios & wait ;;
    *)
        echo "Usage: $0 [android|ios|all]" >&2
        exit 1
        ;;
esac

log "Done."
