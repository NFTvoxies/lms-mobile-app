import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useEnrolledCourses } from '../../hooks/api/courses/useCourses';
import { useNavigation } from '@react-navigation/native';
import { useUserLearningPlans } from '../../hooks/api/learningPlans/useLearningPlans';

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  // Fetch user's enrolled courses
  const {
    data: coursesData,
    isLoading: coursesLoading,
    refetch: refetchCourses,
  } = useEnrolledCourses(user?.id);

  // Fetch user's learning plans
  const {
    data: learningPlansData,
    isLoading: plansLoading,
    refetch: refetchPlans,
  } = useUserLearningPlans(user?.id);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCourses(), refetchPlans()]);
    setRefreshing(false);
  }, [refetchCourses, refetchPlans]);

  // Calculate statistics
  const enrolledCourses = coursesData?.courses || coursesData || [];
  const inProgressCourses = enrolledCourses.filter(
    (c) => c.progress > 0 && c.progress < 100
  );
  const completedCourses = enrolledCourses.filter((c) => c.progress === 100);

  const learningPlans = learningPlansData?.plans || learningPlansData || [];

  if (coursesLoading && plansLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.firstName || user?.name || 'Learner'}!</Text>
          <Text style={styles.subtitle}>Ready to continue learning?</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{enrolledCourses.length}</Text>
            <Text style={styles.statLabel}>Enrolled Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{inProgressCourses.length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCourses.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Continue Learning Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Courses')}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {inProgressCourses.length > 0 ? (
            inProgressCourses.slice(0, 3).map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() =>
                  navigation.navigate('Courses', {
                    screen: 'CourseDetails',
                    params: { courseId: course.id },
                  })
                }
              >
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.name || course.title}</Text>
                  <Text style={styles.courseCode}>{course.code}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${course.progress || 0}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(course.progress || 0)}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No courses in progress</Text>
              <TouchableOpacity
                style={styles.browseCourses}
                onPress={() => navigation.navigate('Courses')}
              >
                <Text style={styles.browseCoursesText}>Browse Courses</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Learning Plans Section */}
        {learningPlans.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Learning Plans</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Learning Plans')}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {learningPlans.slice(0, 2).map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
                onPress={() =>
                  navigation.navigate('Learning Plans', {
                    screen: 'LearningPlanDetails',
                    params: { planId: plan.id },
                  })
                }
              >
                <Text style={styles.planTitle}>{plan.title || plan.name}</Text>
                <Text style={styles.planDescription}>
                  {plan.description || `${plan.coursesCount || 0} courses`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
  },
  courseCard: {
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
  courseInfo: {
    marginBottom: 12,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  browseCourses: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseCoursesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;