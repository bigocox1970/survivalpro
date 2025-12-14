# Offline Survival Pro

A 100% offline survival guide app with an on-device AI assistant, Morse code signaling, and comprehensive wilderness survival content.

## Features

- 📚 **Comprehensive Survival Guides** - Fire starting, water purification, shelter building, foraging, first aid, and rescue signaling
- 🤖 **Offline AI Assistant** - Powered by Llama 3.2 3B running entirely on-device
- 🔦 **Flashlight & Morse Code** - Emergency signaling with preset and custom messages
- 💰 **Yearly Subscription** - Managed via RevenueCat
- 🌙 **Dark Mode Support** - Automatic light/dark theme

## Tech Stack

- **Framework**: Expo SDK 52 with React Native
- **Navigation**: Expo Router (file-based routing)
- **On-Device LLM**: llama.rn (React Native bindings for llama.cpp)
- **Flashlight**: react-native-torch
- **Subscriptions**: react-native-purchases (RevenueCat)
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- Xcode 15+ (for iOS development)
- CocoaPods (`sudo gem install cocoapods`)
- An Apple Developer account (for device testing)

## Setup Instructions

### 1. Install Dependencies

```bash
cd OfflineSurvivalPro
npm install
```

### 2. Create Development Build

This app requires native modules (llama.rn, react-native-torch), so you cannot use Expo Go. You need to create a development build:

```bash
# Generate native projects
npx expo prebuild

# Install iOS dependencies
cd ios && pod install && cd ..
```

### 3. Configure llama.rn

The llama.rn library requires additional setup. See their documentation:
https://github.com/mybigday/llama.rn

Key steps:
1. Download a GGUF model (e.g., Llama-3.2-3B-Instruct-Q4_K_M.gguf)
2. Either bundle it with the app or download on first launch
3. Configure the model path in `src/hooks/useLlamaModel.ts`

### 4. Configure RevenueCat (Subscriptions)

1. Create an account at https://www.revenuecat.com/
2. Set up your app and create a yearly subscription product
3. Get your API key and add it to your app configuration
4. Update the Settings screen with your RevenueCat integration

### 5. Run on iOS Simulator

```bash
npx expo run:ios
```

### 6. Run on Physical Device

```bash
npx expo run:ios --device
```

Or open `ios/OfflineSurvivalPro.xcworkspace` in Xcode and run from there.

## Project Structure

```
OfflineSurvivalPro/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with tab navigation
│   ├── index.tsx            # Home - Survival guides
│   ├── chat.tsx             # AI Assistant chat
│   ├── tools.tsx            # Flashlight & Morse code
│   └── settings.tsx         # Subscription & settings
├── src/
│   ├── components/          # Reusable components
│   ├── data/
│   │   └── survivalContent.ts  # Bundled survival guides
│   ├── hooks/
│   │   └── useLlamaModel.ts    # LLM integration hook
│   ├── services/
│   │   └── morseCode.ts        # Morse code encoder
│   └── utils/               # Utility functions
├── assets/                  # Images, fonts, etc.
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## Model Selection

The app is configured for **Llama 3.2 3B Instruct (Q4_K_M quantization)**:
- Size: ~2.1 GB
- Quality: Good for Q&A tasks
- Speed: Reasonable on modern iPhones (iPhone 12+)

Alternative models you could use:
- **Llama 3.2 1B** (~700MB) - Faster, less capable
- **Phi-3 Mini** (~2GB) - Microsoft's efficient model
- **Mistral 7B** (~4GB) - Higher quality, more memory pressure

## Model Download Strategy

Two options for model delivery:

### Option A: Bundle with App
- Pros: Works immediately, no download needed
- Cons: Large app size (~2GB+), App Store limits

### Option B: Download on First Launch (Recommended)
- Pros: Smaller initial download, can update model separately
- Cons: Requires initial internet, storage management needed

The current implementation uses Option B - see `useLlamaModel.ts`.

## Flashlight/Torch Integration

The app uses `react-native-torch` for flashlight control. In the current scaffold, it shows placeholder alerts. To enable:

1. Uncomment the Torch imports in `app/tools.tsx`
2. Replace Alert calls with actual Torch.switchState() calls

```typescript
import Torch from 'react-native-torch';

const toggleFlashlight = async () => {
  await Torch.switchState(!flashlightOn);
  setFlashlightOn(!flashlightOn);
};
```

## App Store Considerations

1. **App Size**: Apps over 200MB require Wi-Fi for download
2. **Background Modes**: Enable "Audio" for uninterrupted Morse code
3. **Privacy**: No data leaves the device - highlight this in your listing
4. **Model Licensing**: Ensure your chosen LLM allows commercial use

## Customization

### Adding More Survival Content
Edit `src/data/survivalContent.ts` to add categories and topics.

### Changing the AI System Prompt
Modify `SURVIVAL_SYSTEM_PROMPT` in `src/hooks/useLlamaModel.ts`.

### Adding Morse Code Messages
Add entries to the `emergencySignals` array in `app/tools.tsx`.

## Testing

```bash
# Run TypeScript type checking
npx tsc --noEmit

# Run linting
npm run lint
```

## Production Build

```bash
# Create production build for iOS
npx expo build:ios

# Or use EAS Build
eas build --platform ios
```

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Please read our contributing guidelines first.

---

Built with ❤️ for survivalists everywhere. Stay safe out there.
