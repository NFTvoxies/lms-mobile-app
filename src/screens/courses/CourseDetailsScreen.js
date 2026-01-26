import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCourseDetails, useCourseProgress } from '../../hooks/api/courses/useCourses';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const CourseDetailsScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { user } = useAuth();

  const { data: course, isLoading: courseLoading } = useCourseDetails(courseId);
  const { data: progress, isLoading: progressLoading } = useCourseProgress(
    courseId,
    user?.id
  );

  if (courseLoading || progressLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  const progressPercent = progress?.progress || course?.progress || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Course Header */}
        <View style={styles.header}>
          <Text style={styles.courseCode}>{course.code}</Text>
          <Text style={styles.courseName}>{course.name || course.title}</Text>
          
          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor:
                      progressPercent === 100
                        ? '#4CAF50'
                        : progressPercent > 0
                        ? '#007AFF'
                        : '#E0E0E0',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressPercent)}% Complete
            </Text>
          </View>
        </View>

        {/* Course Info */}
        <View style={styles.infoSection}>
          {/* Description */}
          {course.description && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoText}>{course.description}</Text>
            </View>
          )}

          {/* Category */}
          {course.category && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoText}>{course.category}</Text>
            </View>
          )}

          {/* Instructor */}
          {course.instructor && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Instructor</Text>
                  <Text style={styles.infoText}>{course.instructor}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Duration */}
          {course.duration && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="time" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoText}>{course.duration}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Prerequisites</Text>
              {course.prerequisites.map((prereq, index) => (
                <Text key={index} style={styles.prerequisiteText}>
                  • {prereq.name || prereq}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate('CourseContent', { courseId: course.id })
            }
          >
            <Text style={styles.primaryButtonText}>
              {progressPercent > 0 ? 'Continue Learning' : 'Start Course'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  courseCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
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
  infoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  prerequisiteText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionSection: {
    padding: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseDetailsScreen;