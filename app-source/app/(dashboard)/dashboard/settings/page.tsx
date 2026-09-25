'use client';

import React from 'react';
import { SettingsPage } from '@/components/dashboard/SettingsPage';

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
    <SettingsPage
      user={dummyUser}
      socials={{ id: 'demo', userId: 'demo' }}
      onUserUpdate={() => {}}
      onLogout={() => {}}
    />
  );
}
