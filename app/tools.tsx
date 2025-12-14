import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MorseCodeService } from '../src/services/morseCode';
import { useTheme } from '../src/context/ThemeContext';

// Note: In a real build, you'd import from react-native-torch
// import Torch from 'react-native-torch';

export default function ToolsScreen() {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);
  
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isSendingMorse, setIsSendingMorse] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const morseServiceRef = useRef(new MorseCodeService());

  const toggleFlashlight = async () => {
    try {
      // In real implementation:
      // await Torch.switchState(!flashlightOn);
      setFlashlightOn(!flashlightOn);
      
      // Placeholder alert for demo
      Alert.alert(
        flashlightOn ? 'Flashlight Off' : 'Flashlight On',
        'In production build, this will control the device flashlight via react-native-torch'
      );
    } catch (error) {
      Alert.alert('Error', 'Could not control flashlight. Make sure camera permissions are granted.');
    }
  };

  const sendMorseSignal = async (message: string, label: string) => {
    if (isSendingMorse) {
      morseServiceRef.current.stop();
      setIsSendingMorse(false);
      return;
    }

    setIsSendingMorse(true);
    try {
      await morseServiceRef.current.flashMorse(message, (isOn) => {
        // In real implementation, toggle torch here
        // Torch.switchState(isOn);
        console.log(`Flashlight: ${isOn ? 'ON' : 'OFF'}`);
      });
      Alert.alert('Complete', `Finished sending "${label}" in Morse code`);
    } catch (error) {
      console.error('Morse error:', error);
    } finally {
      setIsSendingMorse(false);
    }
  };

  const emergencySignals = [
    { label: 'SOS', message: 'SOS', description: '··· ─── ···', priority: 'high' },
    { label: 'HELP', message: 'HELP', description: '···· · ·─·· ──·─', priority: 'high' },
    { label: 'RESCUE', message: 'RESCUE', description: '·─· · ··· ─·─· ··─ ·', priority: 'medium' },
    { label: 'WATER', message: 'WATER', description: '·── ·─ ─ · ·─·', priority: 'medium' },
    { label: 'FOOD', message: 'FOOD', description: '··─· ─── ─── ─··', priority: 'medium' },
    { label: 'MEDICAL', message: 'MEDICAL', description: '── · ─·· ·· ─·─· ·─ ·─··', priority: 'high' },
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

        <View style={styles.signalGrid}>
          {emergencySignals.map((signal) => (
            <TouchableOpacity
              key={signal.label}
              style={[
                styles.signalButton,
                signal.priority === 'high' && styles.signalButtonHigh,
                isSendingMorse && styles.signalButtonDisabled,
              ]}
              onPress={() => sendMorseSignal(signal.message, signal.label)}
              disabled={isSendingMorse}
              activeOpacity={0.7}
            >
              <Text style={styles.signalLabel}>{signal.label}</Text>
              <Text style={styles.signalMorse}>{signal.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Morse Message */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Message</Text>
        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.customInput}
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="Enter message..."
            placeholderTextColor={isDark ? '#6a6a8a' : '#999'}
            maxLength={20}
            autoCapitalize="characters"
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
      borderColor: 'transparent',
    },
    signalButtonHigh: {
      borderColor: '#e94560',
    },
    signalButtonDisabled: {
      opacity: 0.5,
    },
    signalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginBottom: 4,
    },
    signalMorse: {
      fontSize: 12,
      color: isDark ? '#8a8aaa' : '#666',
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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

// Add Platform import at the top
import { Platform } from 'react-native';
