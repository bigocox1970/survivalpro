import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';

export default function SettingsScreen() {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);

  // Mock state - in production, these would come from AsyncStorage/RevenueCat
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [modelDownloaded, setModelDownloaded] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoLoadModel, setAutoLoadModel] = useState(true);

  const handleSubscribe = () => {
    Alert.alert(
      'Subscription',
      'In production, this will open the RevenueCat paywall for your yearly subscription.',
      [{ text: 'OK' }]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'Checking for previous purchases...',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteModel = () => {
    Alert.alert(
      'Delete AI Model',
      'This will free up ~2GB of storage. You can re-download the model at any time.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setModelDownloaded(false),
        },
      ]
    );
  };

  const handleDownloadModel = () => {
    Alert.alert(
      'Download AI Model',
      'This will download the Llama 3.2 3B model (~2GB). Make sure you have a stable internet connection.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download',
          onPress: () => {
            // In production, trigger the model download
            setModelDownloaded(true);
          },
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Subscription',
      items: [
        {
          icon: 'star',
          label: 'Subscription Status',
          value: isSubscribed ? 'Active' : 'Inactive',
          valueColor: isSubscribed ? '#4ade80' : '#ef4444',
        },
        {
          icon: 'card',
          label: isSubscribed ? 'Manage Subscription' : 'Subscribe Now',
          action: handleSubscribe,
        },
        {
          icon: 'refresh',
          label: 'Restore Purchases',
          action: handleRestorePurchases,
        },
      ],
    },
    {
      title: 'AI Model',
      items: [
        {
          icon: 'hardware-chip',
          label: 'Model Status',
          value: modelDownloaded ? 'Downloaded (2.1 GB)' : 'Not Downloaded',
          valueColor: modelDownloaded ? '#4ade80' : '#f59e0b',
        },
        {
          icon: modelDownloaded ? 'trash' : 'cloud-download',
          label: modelDownloaded ? 'Delete Model' : 'Download Model',
          action: modelDownloaded ? handleDeleteModel : handleDownloadModel,
          destructive: modelDownloaded,
        },
        {
          icon: 'play-circle',
          label: 'Auto-load on startup',
          toggle: true,
          value: autoLoadModel,
          onToggle: setAutoLoadModel,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'phone-portrait',
          label: 'Haptic Feedback',
          toggle: true,
          value: hapticFeedback,
          onToggle: setHapticFeedback,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle',
          label: 'App Version',
          value: '1.0.0',
        },
        {
          icon: 'document-text',
          label: 'Privacy Policy',
          action: () => Linking.openURL('https://yourapp.com/privacy'),
        },
        {
          icon: 'document',
          label: 'Terms of Service',
          action: () => Linking.openURL('https://yourapp.com/terms'),
        },
        {
          icon: 'mail',
          label: 'Contact Support',
          action: () => Linking.openURL('mailto:support@yourapp.com'),
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Offline Badge */}
      <View style={styles.offlineBadge}>
        <Ionicons name="cloud-offline" size={20} color="#4ade80" />
        <Text style={styles.offlineBadgeText}>
          All features work offline
        </Text>
      </View>

      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex < section.items.length - 1 && styles.settingItemBorder,
                ]}
                onPress={item.action}
                disabled={!item.action && !item.toggle}
                activeOpacity={item.action ? 0.7 : 1}
              >
                <View style={styles.settingLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.destructive ? '#ef4444' : '#e94560'}
                  />
                  <Text style={[
                    styles.settingLabel,
                    item.destructive && styles.destructiveText,
                  ]}>
                    {item.label}
                  </Text>
                </View>
                
                {item.toggle ? (
                  <Switch
                    value={item.value as boolean}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#3a3a5a', true: '#e94560' }}
                    thumbColor={item.value ? '#ffffff' : '#cccccc'}
                  />
                ) : item.value ? (
                  <Text style={[
                    styles.settingValue,
                    item.valueColor && { color: item.valueColor },
                  ]}>
                    {item.value}
                  </Text>
                ) : item.action ? (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#6a6a8a' : '#999'}
                  />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Storage Info */}
      <View style={styles.storageInfo}>
        <Ionicons name="folder" size={16} color={isDark ? '#8a8aaa' : '#666'} />
        <Text style={styles.storageText}>
          App Storage: {modelDownloaded ? '2.3 GB' : '150 MB'}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for survivalists everywhere
        </Text>
        <Text style={styles.footerSubtext}>
          Powered by Llama 3.2 • 100% On-Device AI
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
    offlineBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      backgroundColor: isDark ? '#0f2e1a' : '#e6f7ed',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 8,
    },
    offlineBadgeText: {
      marginLeft: 8,
      color: '#4ade80',
      fontWeight: '600',
    },
    section: {
      marginTop: 24,
      marginHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#8a8aaa' : '#666',
      marginBottom: 8,
      marginLeft: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sectionContent: {
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    settingItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2a2a4e' : '#f0f0f0',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      color: isDark ? '#eaeaea' : '#333',
      marginLeft: 12,
    },
    destructiveText: {
      color: '#ef4444',
    },
    settingValue: {
      fontSize: 14,
      color: isDark ? '#8a8aaa' : '#666',
    },
    storageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
      padding: 12,
    },
    storageText: {
      fontSize: 12,
      color: isDark ? '#8a8aaa' : '#666',
      marginLeft: 6,
    },
    footer: {
      alignItems: 'center',
      padding: 24,
      marginBottom: 32,
    },
    footerText: {
      fontSize: 14,
      color: isDark ? '#6a6a8a' : '#999',
    },
    footerSubtext: {
      fontSize: 12,
      color: isDark ? '#4a4a6a' : '#bbb',
      marginTop: 4,
    },
  });
