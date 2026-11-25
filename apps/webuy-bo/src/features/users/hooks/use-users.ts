import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/commerce-api';

export function useUsers() {
  return useQuery({
    queryKey: ['bo', 'users'],
    queryFn: () => fetchUsers(30),
    staleTime: 60_000,
  });
}
