import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEnrolledCourses } from '../../hooks/api/courses/useCourses';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

const CoursesScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [sortAttr, setSortAttr] = useState('enrollment_date');

  const {
    data: coursesResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useEnrolledCourses(sortAttr, 'desc');

  // The hook now returns the courses array directly
  const courses = Array.isArray(coursesResponse) ? coursesResponse : [];


  // Get status badge info based on enrollment status and validity
  const getStatusInfo = (course) => {
    const enrollmentStatus = course?.enrollment?.enrollment_status;
    const validityStatus = course?.enrollment?.enrollment_validity_status;

    if (validityStatus === 'expired') {
      return { label: 'Expired', color: '#D32F2F', bgColor: '#FFEBEE' };
    }

    if (enrollmentStatus === 'completed') {
      return { label: 'Completed', color: '#388E3C', bgColor: '#E8F5E9' };
    }

    if (enrollmentStatus === 'in_progress') {
      return { label: 'In Progress', color: '#F57C00', bgColor: '#FFF3E0' };
    }

    if (enrollmentStatus === 'enrolled') {
      return { label: 'Not Started', color: '#1976D2', bgColor: '#E3F2FD' };
    }

    return { label: 'New', color: '#7B1FA2', bgColor: '#F3E5F5' };
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchQuery ||
      course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (filterTab === 'in-progress') {
      matchesTab = course.enrollment?.enrollment_status === 'in_progress';
    } else if (filterTab === 'completed') {
      matchesTab = course.enrollment?.enrollment_status === 'completed';
    } else if (filterTab === 'not-started') {
      matchesTab = course.enrollment?.enrollment_status === 'enrolled';
    } else if (filterTab === 'expired') {
      matchesTab = course.enrollment?.enrollment_validity_status === 'expired';
    }

    return matchesSearch && matchesTab;
  });

  // Get counts for tabs
  const getTabCounts = () => {
    return {
      all: courses.length,
      inProgress: courses.filter(c => c.enrollment?.enrollment_status === 'in_progress').length,
      completed: courses.filter(c => c.enrollment?.enrollment_status === 'completed').length,
      notStarted: courses.filter(c => c.enrollment?.enrollment_status === 'enrolled').length,
      expired: courses.filter(c => c.enrollment?.enrollment_validity_status === 'expired').length,
    };
  };

  const counts = getTabCounts();

  const renderCourseCard = ({ item, index }) => {
    const status = getStatusInfo(item);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: index * 80 }}
      >
        <TouchableOpacity
          style={styles.courseCard}
          onPress={() =>
            router.push(`/courses/${item.id}`)
          }
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            {/* Course Image */}
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.courseImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="book-outline" size={32} color="#999" />
                </View>
              )}
              {/* Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </View>

            {/* Course Info */}
            <View style={styles.courseInfo}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseName} numberOfLines={2}>
                  {item.name}
                </Text>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons
                    name={item.is_favorite ? 'heart' : 'heart-outline'}
                    size={22}
                    color={item.is_favorite ? '#E76F51' : '#999'}
                  />
                </TouchableOpacity>
              </View>

              {/* Course Meta */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.metaText}>{item.formatted_duration || '0m'}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="language-outline" size={14} color="#666" />
                  <Text style={styles.metaText}>{item.language?.toUpperCase()}</Text>
                </View>
                {item.content_type && (
                  <View style={styles.typeChip}>
                    <Text style={styles.typeText}>{item.content_type}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <Text style={styles.subtitle}>{courses.length} courses enrolled</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsScrollContainer}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, filterTab === 'all' && styles.activeTab]}
            onPress={() => setFilterTab('all')}
          >
            <Text style={[styles.tabText, filterTab === 'all' && styles.activeTabText]}>
              All ({counts.all})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filterTab === 'in-progress' && styles.activeTab]}
            onPress={() => setFilterTab('in-progress')}
          >
            <Text style={[styles.tabText, filterTab === 'in-progress' && styles.activeTabText]}>
              In Progress ({counts.inProgress})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filterTab === 'completed' && styles.activeTab]}
            onPress={() => setFilterTab('completed')}
          >
            <Text style={[styles.tabText, filterTab === 'completed' && styles.activeTabText]}>
              Completed ({counts.completed})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, filterTab === 'not-started' && styles.activeTab]}
            onPress={() => setFilterTab('not-started')}
          >
            <Text style={[styles.tabText, filterTab === 'not-started' && styles.activeTabText]}>
              Not Started ({counts.notStarted})
            </Text>
          </TouchableOpacity>

          {counts.expired > 0 && (
            <TouchableOpacity
              style={[styles.tab, filterTab === 'expired' && styles.activeTab]}
              onPress={() => setFilterTab('expired')}
            >
              <Text style={[styles.tabText, filterTab === 'expired' && styles.activeTabText]}>
                Expired ({counts.expired})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Courses List */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search'
                : 'You have no courses in this category'}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4F2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4F2',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#F7F4F2',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
  },
  tabsScrollContainer: {
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTab: {
    backgroundColor: '#1A2A3A',
    borderColor: '#1A2A3A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90, // Tab bar height (70px) + spacing (20px)
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  typeChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1976D2',
    textTransform: 'uppercase',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  clearButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1A2A3A',
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CoursesScreen;