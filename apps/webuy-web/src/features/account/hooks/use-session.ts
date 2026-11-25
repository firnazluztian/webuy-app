'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMe, loginAsRandomUser, logoutRequest } from '@/lib/client-api';
import { queryKeys, staleTimes } from '@/lib/query-keys';

export function useSession() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    staleTime: staleTimes.me,
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
      client.setQueryData(queryKeys.me, null);
    },
  });
}
