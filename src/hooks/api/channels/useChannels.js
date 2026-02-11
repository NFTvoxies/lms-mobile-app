import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { queryKeys } from '../../../api/queryClient';
import { getStoredTenantId } from '../../../utils/storage';

export const useChannelsWithContents = (lang = 'fr', options = {}) => {
  return useQuery({
    queryKey: queryKeys.channelsWithContents(lang),
    queryFn: async () => {
      const tenantId = await getStoredTenantId();
      const normalizedTenantId = tenantId === 'learn' ? 'taallum' : tenantId;
      const tenantSegment = normalizedTenantId
        ? `/${normalizedTenantId}`
        : '/taallum';
      const response = await apiClient.get(
        `${tenantSegment}/v1/learn/my-channels-with-contents`,
        {
          params: { lang },
        }
      );
      return response.data;
    },
    ...options,
  });
};
