'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { ACCOUNT_INSIGHTS_STORAGE_PREFIX } from '@/features/account/constants';
import {
  fetchMe,
  loginAsRandomUser,
  logoutRequest,
  SessionExpiredError,
} from '@/lib/client-api';
import { queryKeys, staleTimes } from '@/lib/query-keys';

function clearAccountInsightsCache() {
  if (typeof window === 'undefined') {
    return;
  }
  const keysToRemove: string[] = [];
  for (let index = 0; index < window.sessionStorage.length; index += 1) {
    const key = window.sessionStorage.key(index);
    if (key?.startsWith(`${ACCOUNT_INSIGHTS_STORAGE_PREFIX}:`)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => window.sessionStorage.removeItem(key));
}

export function resetSessionCache(client: QueryClient) {
  clearAccountInsightsCache();
  client.removeQueries({ queryKey: ['account', 'insights'] });
  client.setQueryData(queryKeys.me, null);
}

export function useSession() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    staleTime: staleTimes.me,
    retry: (failureCount, error) =>
      !(error instanceof SessionExpiredError) && failureCount < 1,
  });
}

/** Signs in via commerce auth using a user from the users directory. */
export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: loginAsRandomUser,
    onSuccess: (user) => {
      const { accessToken: _a, refreshToken: _r, ...safe } = user;
      client.setQueryData(queryKeys.me, safe);
    },
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      resetSessionCache(client);
    },
  });
}
