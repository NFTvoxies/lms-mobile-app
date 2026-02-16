import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys - Centralized query key management
export const queryKeys = {
  // Auth
  user: ['user'],

  // Courses
  courses: (filters) => ['courses', filters],
  enrolledCourses: (userId) => ['enrolledCourses', userId],
  courseDetails: (courseId) => ['course', courseId],
  coursePreview: (courseId, trackEnabled) => ['coursePreview', courseId, trackEnabled],
  courseContent: (courseId) => ['courseContent', courseId],
  courseProgress: (courseId, userId) => ['courseProgress', courseId, userId],

  // Categories
  categories: (parentId) => ['categories', parentId],
  categoryTree: ['categoryTree'],

  // Learning Plans
  learningPlans: (filters) => ['learningPlans', filters],
  learningPlanDetails: (planId) => ['learningPlan', planId],
  userLearningPlans: (userId) => ['userLearningPlans', userId],

  // Notifications
  notifications: (userId) => ['notifications', userId],
  notificationCount: (userId) => ['notificationCount', userId],

  // Dashboard
  dashboardStats: (userId) => ['dashboardStats', userId],
  recentActivity: (userId) => ['recentActivity', userId],

  // Channels
  channelsWithContents: (lang) => ['channelsWithContents', lang],
};