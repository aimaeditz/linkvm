'use client';

import React from 'react';
import { PublicProfilePage } from '@/src/components/public/PublicProfilePage';
import { DEFAULT_THEME, presetToConfig } from '@/lib/themes';

const dummyUser = {
  id: 'demo',
  name: 'Creator',
  username: 'creator',
  email: 'creator@linkvm.online',
  bio: 'Welcome to my LinkVM profile.',
  avatarUrl: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function UserProfilePage() {
  return (
    <PublicProfilePage
      user={dummyUser}
      links={[]}
      theme={presetToConfig(DEFAULT_THEME, 'demo')}
      onNavigateHome={() => {
        window.location.href = '/';
      }}
    />
  );
}
