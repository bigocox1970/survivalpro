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

  const lightTap = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const mediumTap = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const heavyTap = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const success = () => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const warning = () => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const error = () => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
