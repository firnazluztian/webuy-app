import { useState } from 'react';
import { Button } from '@kiichan/design-system';
import { Login } from '@/features/auth';
import { useBoAuth } from '@/features/auth/hooks/use-bo-auth';
import { Orders } from '@/features/orders';
import { AppProviders } from '@/features/shell/components/providers';
import { Users } from '@/features/users';

type BoView = 'users' | 'orders';

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [view, setView] = useState<BoView>('users');

  return (
    <div className="min-h-screen bg-light">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <p className="text-lg font-semibold text-primary">WeBuy Backoffice</p>
            <nav className="flex gap-3 text-sm">
              <button
                type="button"
                className={view === 'users' ? 'font-medium text-primary' : 'text-neutral-600'}
                onClick={() => setView('users')}
              >
                Users
              </button>
              <button
                type="button"
                className={view === 'orders' ? 'font-medium text-primary' : 'text-neutral-600'}
                onClick={() => setView('orders')}
              >
                Orders
              </button>
            </nav>
          </div>
          <Button type="button" variant="primary" size="md" rounded="xl" onClick={onLogout}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
          {view === 'users' ? 'Users' : 'Orders'}
        </h1>
        {view === 'users' ? <Users /> : <Orders />}
      </main>
    </div>
  );
};

export const App = () => {
  const auth = useBoAuth();

  return (
    <AppProviders>
      {auth.authenticated ? (
        <Dashboard onLogout={auth.logout} />
      ) : (
        <Login onLogin={auth.login} />
      )}
    </AppProviders>
  );
};
