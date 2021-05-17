#!/bin/bash

VERSION='0.4.0'

## US
# Android
curl \
  -F "payload=@../apps/Android-NativeDemoApp-$VERSION.apk" \
  -F name=wdio-demo-app-android.apk \
  -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY"  \
  'https://api.us-west-1.saucelabs.com/v1/storage/upload'
# iOS
curl \
  -F "payload=@../apps/iOS-Simulator-NativeDemoApp-$VERSION.app.zip" \
  -F name=wdio-demo-app-ios.zip \
  -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY"  \
  'https://api.us-west-1.saucelabs.com/v1/storage/upload'

## EU
# Android
curl \
  -F "payload=@../apps/Android-NativeDemoApp-$VERSION.apk" \
  -F name=wdio-demo-app-android.apk \
  -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY"  \
  'https://api.eu-central-1.saucelabs.com/v1/storage/upload'
# iOS
curl \
  -F "payload=@../apps/iOS-Simulator-NativeDemoApp-$VERSION.app.zip" \
  -F name=wdio-demo-app-ios.zip \
  -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY"  \
  'https://api.eu-central-1.saucelabs.com/v1/storage/upload'
