import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useUserLearningPlans } from '../../hooks/api/learningPlans/useLearningPlans';

const LearningPlansScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { data: plansData, isLoading } = useUserLearningPlans(user?.id);

  const plans = plansData?.plans || plansData || [];

  const renderPlanCard = ({ item }) => (
    <TouchableOpacity
      style={styles.planCard}
      onPress={() =>
        navigation.navigate('LearningPlanDetails', { planId: item.id })
      }
    >
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <Text style={styles.planTitle}>{item.title || item.name}</Text>
          <Text style={styles.planCode}>{item.code}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </View>

      {item.description && (
        <Text style={styles.planDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.planMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="book-outline" size={16} color="#666" />
          <Text style={styles.metaText}>
            {item.coursesCount || item.courses?.length || 0} Courses
          </Text>
        </View>
        {item.progress !== undefined && (
          <View style={styles.metaItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{Math.round(item.progress)}% Complete</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Plans</Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderPlanCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No learning plans assigned</Text>
          </View>
        }
      />
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planInfo: {
    flex: 1,
    marginRight: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  planCode: {
    fontSize: 14,
    color: '#666',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  planMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default LearningPlansScreen;