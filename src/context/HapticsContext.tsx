import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HapticsContextType {
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  lightTap: () => void;
  mediumTap: () => void;
  heavyTap: () => void;
  success: () => void;
  warning: () => void;
  error: () => void;
}

const HapticsContext = createContext<HapticsContextType | undefined>(undefined);

const HAPTICS_STORAGE_KEY = '@haptics_enabled';

export function HapticsProvider({ children }: { children: ReactNode }) {
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(HAPTICS_STORAGE_KEY);
      if (saved !== null) {
        setHapticsEnabledState(saved === 'true');
      }
    } catch (e) {
      console.error('Failed to load haptics preference:', e);
    }
  };

  const setHapticsEnabled = async (enabled: boolean) => {
    setHapticsEnabledState(enabled);
    try {
      await AsyncStorage.setItem(HAPTICS_STORAGE_KEY, enabled.toString());
    } catch (e) {
      console.error('Failed to save haptics preference:', e);
    }
  };

  const lightTap = async () => {
    if (hapticsEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        console.log('Haptics error:', e);
      }
    }
  };

  const mediumTap = async () => {
    if (hapticsEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        console.log('Haptics error:', e);
      }
    }
  };

  const heavyTap = async () => {
    if (hapticsEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (e) {
        console.log('Haptics error:', e);
      }
    }
  };

  const success = async () => {
    if (hapticsEnabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        console.log('Haptics error:', e);
      }
    }
  };

  const warning = async () => {
    if (hapticsEnabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (e) {
        console.log('Haptics error:', e);
      }
    }
  };

  const error = async () => {
    if (hapticsEnabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (e) {
        console.log('Haptics error:', e);
      }
    }
  };

  return (
    <HapticsContext.Provider value={{
      hapticsEnabled,
      setHapticsEnabled,
      lightTap,
      mediumTap,
      heavyTap,
      success,
      warning,
      error,
    }}>
      {children}
    </HapticsContext.Provider>
  );
}

export function useHaptics() {
  const context = useContext(HapticsContext);
  if (context === undefined) {
    throw new Error('useHaptics must be used within a HapticsProvider');
  }
  return context;
}
