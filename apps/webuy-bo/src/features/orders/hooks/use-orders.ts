import { useQuery } from '@tanstack/react-query';
import { fetchCarts } from '@/lib/commerce-api';

export function useOrders() {
  return useQuery({
    queryKey: ['bo', 'orders'],
    queryFn: () => fetchCarts(20),
    staleTime: 30_000,
  });
}
