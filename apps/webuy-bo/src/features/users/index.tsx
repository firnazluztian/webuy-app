import { useUsers } from '@/features/users/hooks/use-users';

export const Users = () => {
  const { data, isLoading, isError, refetch } = useUsers();

  if (isLoading) {
    return <p className="text-sm text-neutral-600">Loading users…</p>;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-600">Unable to load users.</p>
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
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Email</th>
            <th className="px-3 py-2 font-medium">Username</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((user) => (
            <tr key={user.id} className="border-b border-neutral-100">
              <td className="px-3 py-2">{user.id}</td>
              <td className="px-3 py-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-3 py-2">{user.email}</td>
              <td className="px-3 py-2">{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
