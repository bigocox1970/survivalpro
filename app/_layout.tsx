import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { HapticsProvider, useHaptics } from '../src/context/HapticsContext';

SplashScreen.preventAutoHideAsync();

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  const { lightTap } = useHaptics();

  const handlePress = () => {
    lightTap();
    toggleTheme();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 16 }}>
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={24}
        color={isDark ? '#eaeaea' : '#1a1a2e'}
      />
    </TouchableOpacity>
  );
}

function TabsLayout() {
  const { isDark } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const colors = {
    background: isDark ? '#1a1a2e' : '#f5f5f5',
    card: isDark ? '#16213e' : '#ffffff',
    text: isDark ? '#eaeaea' : '#1a1a2e',
    primary: '#e94560',
    inactive: isDark ? '#4a4a6a' : '#9a9a9a',
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inactive,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: isDark ? '#2a2a4e' : '#e0e0e0',
          },
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <ThemeToggleButton />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Survival Guide',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'AI Assistant',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            title: 'SOS',
            tabBarIcon: ({ focused }) => (
              <View style={{
                backgroundColor: focused ? colors.primary : 'transparent',
                borderRadius: 22,
                width: 44,
                height: 44,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.primary,
                marginTop: 14,
              }}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: 'bold',
                  color: focused ? '#ffffff' : colors.inactive,
                }}>SOS</Text>
              </View>
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tabs.Screen
          name="prepare"
          options={{
            title: 'Prepare',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <HapticsProvider>
        <TabsLayout />
      </HapticsProvider>
    </ThemeProvider>
  );
}
