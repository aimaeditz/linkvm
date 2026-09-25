'use client';

import React from 'react';
import { OverviewPage } from '@/components/dashboard/OverviewPage';

const dummyUser = {
  id: 'demo',
  name: 'Creator',
  username: 'creator',
  email: 'creator@linkvm.online',
  bio: 'Welcome to LinkVM.',
  avatarUrl: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function Page() {
  return (
    <OverviewPage
      user={dummyUser}
      links={[]}
      analytics={[]}
      onNavigateTab={() => {}}
      onViewPublic={() => {}}
      onOpenShareModal={() => {}}
    />
  );
}
