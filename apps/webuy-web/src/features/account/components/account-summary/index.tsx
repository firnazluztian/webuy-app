'use client';

import { Avatar, Text } from '@kiichan/design-system';
import { getKiichanImage } from '@/lib/kiichan/images';
import type { AuthUser } from '@/lib/schemas';

interface AccountSummaryProps {
  user: AuthUser;
}

export const AccountSummary = ({ user }: AccountSummaryProps) => {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar
        src={getKiichanImage('delighted')}
        alt={fullName || user.username}
        shape="circle"
        variant="cover"
        className="h-12 w-12 shrink-0 ring-1 ring-neutral-200 sm:h-14 sm:w-14"
      />
      <div className="min-w-0 flex flex-col gap-0.5">
        <Text variant="subtitle1" className="truncate text-neutral-900">
          {fullName || user.username}
        </Text>
        <Text variant="caption" className="truncate text-neutral-500">
          {user.email}
        </Text>
      </div>
    </div>
  );
};
