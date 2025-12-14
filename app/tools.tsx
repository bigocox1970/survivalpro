import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MorseCodeService } from '../src/services/morseCode';
import { useTheme } from '../src/context/ThemeContext';
import { useHaptics } from '../src/context/HapticsContext';
import Torch from 'react-native-torch';

export default function ToolsScreen() {
  const { isDark } = useTheme();
  const { lightTap, mediumTap, heavyTap } = useHaptics();
  const styles = createStyles(isDark);

  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isSendingMorse, setIsSendingMorse] = useState(false);
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [loopEnabled, setLoopEnabled] = useState(false);
  const morseServiceRef = useRef(new MorseCodeService());
  const loopingRef = useRef(false);

  const toggleFlashlight = async () => {
    heavyTap();
    try {
      const newState = !flashlightOn;
      await Torch.switchState(newState);
      setFlashlightOn(newState);
    } catch (error) {
      Alert.alert('Error', 'Could not control flashlight. Make sure camera permissions are granted.');
    }
  };

  const sendMorseSignal = async (message: string, label: string) => {
    mediumTap();
    if (isSendingMorse) {
      loopingRef.current = false;
      morseServiceRef.current.stop();
      await Torch.switchState(false);
      setIsSendingMorse(false);
      setActiveSignal(null);
      return;
    }

    setIsSendingMorse(true);
    setActiveSignal(label);
    loopingRef.current = loopEnabled;

    try {
      do {
        await morseServiceRef.current.flashMorse(message, (isOn) => {
          Torch.switchState(isOn);
        });

        if (loopingRef.current) {
          // 4 second pause between loops
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      } while (loopingRef.current);
    } catch (error) {
      console.error('Morse error:', error);
      await Torch.switchState(false);
    } finally {
      await Torch.switchState(false);
      setIsSendingMorse(false);
      setActiveSignal(null);
    }
  };

  const emergencySignals = [
    { label: 'SOS', message: 'SOS', description: '· · ·   ─ ─ ─   · · ·' },
    { label: 'HELP', message: 'HELP', description: '· · · ·   ·   · ─ · ·   ─ ─ · ─' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Flashlight Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flashlight</Text>
        <TouchableOpacity
          style={[styles.flashlightButton, flashlightOn && styles.flashlightButtonOn]}
          onPress={toggleFlashlight}
          activeOpacity={0.8}
        >
          <Ionicons
            name={flashlightOn ? 'flashlight' : 'flashlight-outline'}
            size={64}
            color={flashlightOn ? '#1a1a2e' : '#e94560'}
          />
          <Text style={[styles.flashlightText, flashlightOn && styles.flashlightTextOn]}>
            {flashlightOn ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Morse Signals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Morse Signals</Text>
        <Text style={styles.sectionSubtitle}>
          Tap to flash signal • Tap again to stop
        </Text>

        <TouchableOpacity
          style={styles.loopToggle}
          onPress={() => { lightTap(); setLoopEnabled(!loopEnabled); }}
          activeOpacity={0.7}
        >
          <View style={styles.loopToggleLeft}>
            <Ionicons
              name="repeat"
              size={20}
              color={loopEnabled ? '#e94560' : (isDark ? '#8a8aaa' : '#666')}
            />
            <Text style={[styles.loopToggleText, loopEnabled && styles.loopToggleTextActive]}>
              Loop continuously
            </Text>
          </View>
          <View style={[styles.loopIndicator, loopEnabled && styles.loopIndicatorActive]}>
            <Text style={[styles.loopIndicatorText, loopEnabled && styles.loopIndicatorTextActive]}>
              {loopEnabled ? 'ON' : 'OFF'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.signalGrid}>
          {emergencySignals.map((signal) => {
            const isActive = activeSignal === signal.label;
            return (
              <TouchableOpacity
                key={signal.label}
                style={[
                  styles.signalButton,
                  isActive && styles.signalButtonActive,
                  isSendingMorse && !isActive && styles.signalButtonDisabled,
                ]}
                onPress={() => sendMorseSignal(signal.message, signal.label)}
                disabled={isSendingMorse && !isActive}
                activeOpacity={0.7}
              >
                {isActive && (
                  <View style={styles.activeIndicator}>
                    <Text style={styles.activeIndicatorText}>FLASHING: {signal.label}</Text>
                  </View>
                )}
                <Text style={[styles.signalLabel, isActive && styles.signalLabelActive]}>
                  {isActive ? 'TAP TO STOP' : signal.label}
                </Text>
                <Text style={[styles.signalMorse, isActive && styles.signalMorseActive]}>
                  {signal.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Custom Morse Message */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Message</Text>
        {activeSignal === customMessage && customMessage ? (
          <TouchableOpacity
            style={styles.customActiveButton}
            onPress={() => sendMorseSignal(customMessage, customMessage)}
            activeOpacity={0.7}
          >
            <View style={styles.activeIndicator}>
              <Text style={styles.activeIndicatorText}>FLASHING: {customMessage.toUpperCase()}</Text>
            </View>
            <Text style={styles.customActiveLabel}>TAP TO STOP</Text>
            <Text style={styles.customActiveMorse}>
              {MorseCodeService.toMorseDisplay(customMessage)}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                value={customMessage}
                onChangeText={setCustomMessage}
                placeholder="Enter message..."
                placeholderTextColor={isDark ? '#6a6a8a' : '#999'}
                maxLength={20}
                autoCapitalize="characters"
                editable={!isSendingMorse}
              />
              <TouchableOpacity
                style={[
                  styles.sendCustomButton,
                  (!customMessage.trim() || isSendingMorse) && styles.sendCustomButtonDisabled,
                ]}
                onPress={() => sendMorseSignal(customMessage, customMessage)}
                disabled={!customMessage.trim() || isSendingMorse}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={(!customMessage.trim() || isSendingMorse) ? '#6a6a8a' : '#ffffff'}
                />
              </TouchableOpacity>
            </View>
            {customMessage && (
              <Text style={styles.morsePreview}>
                {MorseCodeService.toMorseDisplay(customMessage)}
              </Text>
            )}
          </>
        )}
      </View>

      {/* Morse Code Reference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Morse Code Reference</Text>
        <View style={styles.referenceGrid}>
          {MorseCodeService.getAlphabetReference().map(({ letter, morse }) => (
            <View key={letter} style={styles.referenceItem}>
              <Text style={styles.referenceLetter}>{letter}</Text>
              <Text style={styles.referenceMorse}>{morse}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Ionicons name="information-circle-outline" size={20} color={isDark ? '#8a8aaa' : '#666'} />
        <Text style={styles.infoText}>
          Standard Morse timing: Dot = 200ms, Dash = 600ms{'\n'}
          Gap between letters = 600ms, Gap between words = 1400ms
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a2e' : '#f5f5f5',
    },
    contentContainer: {
      paddingBottom: 100,
    },
    section: {
      padding: 16,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: isDark ? '#8a8aaa' : '#666',
      marginBottom: 16,
    },
    loopToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      padding: 12,
      borderRadius: 10,
      marginBottom: 16,
    },
    loopToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loopToggleText: {
      fontSize: 15,
      color: isDark ? '#8a8aaa' : '#666',
      marginLeft: 10,
    },
    loopToggleTextActive: {
      color: isDark ? '#eaeaea' : '#1a1a2e',
    },
    loopIndicator: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
    loopIndicatorActive: {
      backgroundColor: '#e94560',
    },
    loopIndicatorText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: isDark ? '#6a6a8a' : '#999',
    },
    loopIndicatorTextActive: {
      color: '#ffffff',
    },
    flashlightButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      borderRadius: 100,
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      alignSelf: 'center',
      width: 180,
      height: 180,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    flashlightButtonOn: {
      backgroundColor: '#fbbf24',
    },
    flashlightText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#e94560',
      marginTop: 8,
    },
    flashlightTextOn: {
      color: '#1a1a2e',
    },
    signalGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    signalButton: {
      width: '48%',
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e94560',
    },
    signalButtonActive: {
      backgroundColor: '#e94560',
      borderColor: '#e94560',
    },
    signalButtonDisabled: {
      opacity: 0.5,
    },
    activeIndicator: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginBottom: 8,
    },
    activeIndicatorText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#e94560',
    },
    signalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginBottom: 4,
    },
    signalLabelActive: {
      color: '#ffffff',
    },
    signalMorse: {
      fontSize: 12,
      color: isDark ? '#8a8aaa' : '#666',
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    signalMorseActive: {
      color: 'rgba(255,255,255,0.8)',
    },
    customActiveButton: {
      backgroundColor: '#e94560',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e94560',
    },
    customActiveLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 4,
    },
    customActiveMorse: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      textAlign: 'center',
    },
    customInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    customInput: {
      flex: 1,
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: isDark ? '#eaeaea' : '#333',
    },
    sendCustomButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#e94560',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    sendCustomButtonDisabled: {
      backgroundColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
    morsePreview: {
      marginTop: 12,
      fontSize: 14,
      color: isDark ? '#8a8aaa' : '#666',
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      textAlign: 'center',
    },
    referenceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    referenceItem: {
      width: '16.66%',
      padding: 8,
      alignItems: 'center',
    },
    referenceLetter: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#eaeaea' : '#1a1a2e',
    },
    referenceMorse: {
      fontSize: 10,
      color: isDark ? '#8a8aaa' : '#666',
      marginTop: 2,
    },
    infoSection: {
      flexDirection: 'row',
      padding: 16,
      margin: 16,
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      borderRadius: 12,
      alignItems: 'flex-start',
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      color: isDark ? '#8a8aaa' : '#666',
      marginLeft: 8,
      lineHeight: 18,
    },
  });
