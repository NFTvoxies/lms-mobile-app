import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLearningPlanDetails } from '../../hooks/api/learningPlans/useLearningPlans';
import { useLocalSearchParams } from 'expo-router';

const LearningPlanDetailsScreen = () => {
  const { planId } = useLocalSearchParams();
  const { data: plan, isLoading } = useLearningPlanDetails(planId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{plan?.title || plan?.name || 'Learning Plan'}</Text>
          <Text style={styles.code}>{plan?.code}</Text>
          
          {plan?.description && (
            <Text style={styles.description}>{plan.description}</Text>
          )}
          
          <Text style={styles.sectionTitle}>Courses in this plan:</Text>
          <Text style={styles.placeholder}>
            List of courses will be displayed here with their progress
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  code: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default LearningPlanDetailsScreen;