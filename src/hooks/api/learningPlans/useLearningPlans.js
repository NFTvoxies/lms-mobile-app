import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { queryKeys } from '../../../api/queryClient';

// ============ Get User's Learning Plans ============
export const useUserLearningPlans = (userId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.userLearningPlans(userId),
    queryFn: async () => {
      // Adjust endpoint to match your API
      const response = await apiClient.get(`/users/${userId}/learning-plans`);
      return response.data;
    },
    enabled: !!userId,
    ...options,
  });
};

// ============ Get Learning Plan Details ============
export const useLearningPlanDetails = (planId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.learningPlanDetails(planId),
    queryFn: async () => {
      const response = await apiClient.get(`/learning-plans/${planId}`);
      return response.data;
    },
    enabled: !!planId,
    ...options,
  });
};

// ============ Get All Learning Plans (Browse) ============
export const useLearningPlans = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.learningPlans(filters),
    queryFn: async () => {
      const response = await apiClient.get('/learning-plans', {
        params: {
          page: filters.page || 0,
          pageSize: filters.pageSize || 15,
          search: filters.search || '',
          ...filters,
        },
      });
      return response.data;
    },
    ...options,
  });
};