import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { survivalCategories, SurvivalCategory, SurvivalTopic } from '../src/data/survivalContent';
import { useTheme } from '../src/context/ThemeContext';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<SurvivalTopic | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setSelectedTopic(null);
  };

  const selectTopic = (topic: SurvivalTopic) => {
    setSelectedTopic(selectedTopic?.id === topic.id ? null : topic);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={32} color="#e94560" />
        <Text style={styles.headerTitle}>Survival Guide</Text>
        <Text style={styles.headerSubtitle}>
          100% Offline • No Internet Required
        </Text>
      </View>

      {survivalCategories.map((category: SurvivalCategory) => (
        <View key={category.id} style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(category.id)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryTitleRow}>
              <Ionicons
                name={category.icon as any}
                size={24}
                color="#e94560"
              />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
            <Ionicons
              name={expandedCategory === category.id ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={isDark ? '#8a8aaa' : '#666'}
            />
          </TouchableOpacity>

          {expandedCategory === category.id && (
            <View style={styles.topicsList}>
              {category.topics.map((topic: SurvivalTopic) => (
                <View key={topic.id}>
                  <TouchableOpacity
                    style={styles.topicItem}
                    onPress={() => selectTopic(topic)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Ionicons
                      name={selectedTopic?.id === topic.id ? 'chevron-up' : 'chevron-forward'}
                      size={16}
                      color={isDark ? '#6a6a8a' : '#999'}
                    />
                  </TouchableOpacity>

                  {selectedTopic?.id === topic.id && (
                    <View style={styles.topicContent}>
                      <Text style={styles.topicSummary}>{topic.summary}</Text>
                      
                      <Text style={styles.stepsHeader}>Steps:</Text>
                      {topic.steps.map((step, index) => (
                        <View key={index} style={styles.stepItem}>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                          </View>
                          <Text style={styles.stepText}>{step}</Text>
                        </View>
                      ))}

                      {topic.tips && topic.tips.length > 0 && (
                        <>
                          <Text style={styles.tipsHeader}>💡 Pro Tips:</Text>
                          {topic.tips.map((tip, index) => (
                            <Text key={index} style={styles.tipText}>• {tip}</Text>
                          ))}
                        </>
                      )}

                      {topic.warnings && topic.warnings.length > 0 && (
                        <>
                          <Text style={styles.warningsHeader}>⚠️ Warnings:</Text>
                          {topic.warnings.map((warning, index) => (
                            <Text key={index} style={styles.warningText}>• {warning}</Text>
                          ))}
                        </>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All content available offline. Stay safe out there.
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
    header: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginTop: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#4ade80',
      marginTop: 4,
    },
    categoryContainer: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    categoryTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginLeft: 12,
    },
    topicsList: {
      borderTopWidth: 1,
      borderTopColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
    topicItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2a2a4e' : '#f0f0f0',
    },
    topicTitle: {
      fontSize: 16,
      color: isDark ? '#c0c0d0' : '#333',
    },
    topicContent: {
      padding: 16,
      backgroundColor: isDark ? '#0f0f23' : '#f9f9f9',
    },
    topicSummary: {
      fontSize: 15,
      lineHeight: 22,
      color: isDark ? '#b0b0c0' : '#444',
      marginBottom: 16,
    },
    stepsHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginBottom: 12,
    },
    stepItem: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    stepNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#e94560',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    stepNumberText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },
    stepText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: isDark ? '#b0b0c0' : '#444',
    },
    tipsHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#eaeaea' : '#1a1a2e',
      marginTop: 16,
      marginBottom: 8,
    },
    tipText: {
      fontSize: 14,
      lineHeight: 20,
      color: '#4ade80',
      marginBottom: 4,
    },
    warningsHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: '#f59e0b',
      marginTop: 16,
      marginBottom: 8,
    },
    warningText: {
      fontSize: 14,
      lineHeight: 20,
      color: '#f59e0b',
      marginBottom: 4,
    },
    footer: {
      padding: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: isDark ? '#6a6a8a' : '#999',
    },
  });
