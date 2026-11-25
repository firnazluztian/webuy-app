import { useOrders } from '@/features/orders/hooks/use-orders';

export const Orders = () => {
  const { data, isLoading, isError, refetch } = useOrders();

  if (isLoading) {
    return <p className="text-sm text-neutral-600">Loading orders…</p>;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-600">Unable to load orders.</p>
        <button type="button" className="text-sm text-primary underline" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-neutral-500">
          <tr>
            <th className="px-3 py-2 font-medium">Cart ID</th>
            <th className="px-3 py-2 font-medium">User</th>
            <th className="px-3 py-2 font-medium">Items</th>
            <th className="px-3 py-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((cart) => (
            <tr key={cart.id} className="border-b border-neutral-100">
              <td className="px-3 py-2">{cart.id}</td>
              <td className="px-3 py-2">{cart.userId}</td>
              <td className="px-3 py-2">{cart.totalQuantity ?? cart.products.length}</td>
              <td className="px-3 py-2">{cart.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
