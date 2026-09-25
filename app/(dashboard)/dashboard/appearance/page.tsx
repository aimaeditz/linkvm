'use client';

import React from 'react';
import { AppearancePage } from '@/components/dashboard/AppearancePage';
import { DEFAULT_THEME, presetToConfig } from '@/lib/themes';

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
    <AppearancePage
      user={dummyUser}
      links={[]}
      theme={presetToConfig(DEFAULT_THEME, 'demo')}
      onThemeChange={() => {}}
    />
  );
}
