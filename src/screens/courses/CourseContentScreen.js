import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CourseContentScreen = ({ route }) => {
  const { courseId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Course Content</Text>
        <Text style={styles.subtitle}>Course ID: {courseId}</Text>
        <Text style={styles.description}>
          This screen will display course modules, lessons, videos, documents, and other learning materials.
        </Text>
        <Text style={styles.description}>
          Features to implement:
          {'\n'}• Module/lesson list
          {'\n'}• Video player
          {'\n'}• Document viewer
          {'\n'}• Quiz/assessment interface
          {'\n'}• Progress tracking per lesson
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
});

export default CourseContentScreen;