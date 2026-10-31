# CARRY — Deployment & Release Guide

## 1. Environments
- **Development**: Local development using Expo Go and Firebase project `carry-bd2d7`.
- **Production**: Standalone APK/AAB for Android and IPA / TestFlight for iOS using Expo Application Services (EAS).

## 2. Configuration & Identifiers
- **App Name**: CARRY
- **Package Name (Android)**: `com.carry`
- **Bundle Identifier (iOS)**: `com.carry`
- **Google Services**:
  - Android: `google-services.json`
  - iOS: `GoogleService-Info.plist`

## 3. Building with EAS
```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo account
eas login

# Configure project
eas build:configure

# Build Android APK / AAB
eas build --platform android --profile preview

# Build iOS IPA for TestFlight
eas build --platform ios --profile production
```
