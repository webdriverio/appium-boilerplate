#!/bin/bash

# Default port
PORT=${1:-4723}

cleanup() {
    echo ""
    echo "🛑 Stopping Appium server..."
    if [ ! -z "$APPIUM_PID" ] && kill -0 "$APPIUM_PID" 2>/dev/null; then
        kill "$APPIUM_PID"
        echo "✅ Appium server (PID: $APPIUM_PID) stopped successfully"
    else
        echo "⚠️  Appium server was already stopped"
    fi
    exit 0
}

trap cleanup EXIT INT TERM

# 1. Start Appium server
echo "🚀 Starting Appium server on port $PORT..."

# Start Appium server from the installed node_modules/.bin/appium and capture output
node_modules/.bin/appium server --log-timestamp --relaxed-security --port $PORT --allow-cors &
APPIUM_PID=$!

echo "📱 Appium server started with PID: $APPIUM_PID"
echo "⏳ Waiting for Appium server to be ready..."

# 2. Wait a moment for the server to initialize
sleep 3

# 3. Check if the process is still running, if not, provide more information about the potential reasons
if ! kill -0 "$APPIUM_PID" 2>/dev/null; then
    echo ""
    echo "❌ ERROR: Appium server failed to start!"
    echo "💡 Possible reasons:"
    echo "   • Port $PORT is already in use"
    echo "   • Appium installation is corrupted"
    echo "   • Missing dependencies"
    echo "   • Permission issues"
    echo ""
    echo "🔧 Try these solutions:"
    echo "   • Use a different port: npm run appium:inspector -- 4725"
    echo "   • Check if port is in use: lsof -i :$PORT"
    echo "   • Reinstall dependencies: npm install"
    echo "   • Check Appium installation: npx appium doctor"
    echo ""
    echo "⚠️  Note: Default Appium port is 4723. If using a custom port,"
    echo "   update the 'Remote Port' field in the Appium Inspector interface."
    exit 1
fi

# 4. Check if server is responding
if ! curl -s "http://localhost:$PORT/status" > /dev/null 2>&1; then
    echo "⚠️  Warning: Appium server started but may not be fully ready"
    echo "🔄 Waiting a bit longer..."
    sleep 2
fi

# 5. Now open the Appium Inspector in Chrome
echo "🌐 Opening Appium Inspector in Chrome..."

# 6. Check if Chrome is available, exit if not found
if [[ -d "/Applications/Google Chrome.app" ]]; then
    open -a "Google Chrome" "https://inspector.appiumpro.com/"
    echo "✅ Opened in Google Chrome"
elif command -v google-chrome &> /dev/null; then
    google-chrome "https://inspector.appiumpro.com/"
    echo "✅ Opened in Google Chrome"
else
    echo "❌ ERROR: Google Chrome is required for Appium Inspector to work properly!"
    echo "📥 Please install Chrome from: https://www.google.com/chrome/"
    echo "🚫 Safari and other browsers are not compatible with Appium Inspector"
    echo ""
    cleanup
fi

echo "✅ Appium Inspector should now be open in your browser!"
echo "🔗 Inspector URL: https://inspector.appiumpro.com/"
echo "📡 Appium Server: http://localhost:$PORT"
echo ""
if [ "$PORT" != "4723" ]; then
    echo "⚠️  IMPORTANT: You're using custom port $PORT"
    echo "   Make sure to set 'Remote Port' to $PORT in the Appium Inspector interface!"
    echo ""
fi
echo "ℹ️  Press Ctrl+C to stop Appium server and exit"
echo "🔄 Keeping script running to manage Appium server..."

wait $APPIUM_PID
