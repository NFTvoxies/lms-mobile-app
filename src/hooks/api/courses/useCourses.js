import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryClient';
import apiClient from '../../../api/client';

// ============ Get Enrolled Courses ============
export const useEnrolledCourses = (sortAttr = 'enrollment_date', sortDir = 'desc', options = {}) => {
  return useQuery({
    queryKey: queryKeys.enrolledCourses(sortAttr, sortDir),
    queryFn: async () => {
      const response = await apiClient.get('/taallum/v1/learn/my-courses-and-learning-plans', {
        params: {
          sort_attr: sortAttr,
          sort_dir: sortDir,
        },
      });
      // Response structure: { success: true, data: [...courses...], status: 200 }
      return response.data?.data || [];
    },
    ...options,
  });
};

// ============ Get All Courses (Browse) ============
export const useCourses = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.courses(filters),
    queryFn: async () => {
      // Adjust endpoint and params to match your API
      const response = await apiClient.get('/courses', {
        params: {
          page: filters.page || 0,
          pageSize: filters.pageSize || 15,
          search: filters.search || '',
          categoryId: filters.categoryId,
          showDescendants: filters.showDescendants,
          ...filters,
        },
      });
      return response.data;
    },
    ...options,
  });
};

// ============ Get Course Details ============
export const useCourseDetails = (courseId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.courseDetails(courseId),
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
    ...options,
  });
};

// ============ Get Course Content ============
export const useCourseContent = (courseId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.courseContent(courseId),
    queryFn: async () => {
      // This endpoint should return course modules, lessons, materials, etc.
      const response = await apiClient.get(`/courses/${courseId}/content`);
      return response.data;
    },
    enabled: !!courseId,
    ...options,
  });
};

// ============ Get Course Progress ============
export const useCourseProgress = (courseId, userId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.courseProgress(courseId, userId),
    queryFn: async () => {
      const response = await apiClient.get(
        `/courses/${courseId}/progress`,
        {
          params: { userId },
        }
      );
      return response.data;
    },
    enabled: !!courseId && !!userId,
    ...options,
  });
};

// ============ Update Course Progress (Mutation) ============
export const useUpdateCourseProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, userId, progressData }) => {
      const response = await apiClient.post(
        `/courses/${courseId}/progress`,
        progressData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch course progress
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseProgress(variables.courseId, variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrolledCourses(variables.userId),
      });
    },
  });
};

// ============ Search Courses ============
export const useSearchCourses = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: ['coursesSearch', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get('/courses/search', {
        params: { q: searchQuery },
      });
      return response.data;
    },
    enabled: searchQuery.length > 2, // Only search if query is longer than 2 characters
    ...options,
  });
};

// ============ Get Categories ============
export const useCategories = (parentId = null, options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories(parentId),
    queryFn: async () => {
      const response = await apiClient.get('/categories', {
        params: { parentId },
      });
      return response.data;
    },
    ...options,
  });
};