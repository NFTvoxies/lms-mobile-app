import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryClient';
import apiClient from '../../../api/client';

/**
 * Hook to fetch course preview data including learning units and SCORM info
 * @param {number|string} courseId - The ID of the course
 * @param {boolean} trackEnabled - Whether to enable tracking (default: true)
 */
export const useCoursePreview = (courseId, trackEnabled = true, options = {}) => {
    return useQuery({
        queryKey: queryKeys.coursePreview(courseId, trackEnabled),
        queryFn: async () => {
            const response = await apiClient.get(`/taallum/v1/courses/${courseId}/preview`, {
                params: {
                    trackEnabled,
                },
            });
            // Response structure: { success: true, data: { course, learning_units, ... }, status: 200 }
            return response.data?.data;
        },
        enabled: !!courseId,
        ...options,
    });
};
