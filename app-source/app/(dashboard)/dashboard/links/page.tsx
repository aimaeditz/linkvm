'use client';

import React from 'react';
import { LinksPage } from '@/components/dashboard/LinksPage';

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
    <LinksPage
      user={dummyUser}
      links={[]}
      onLinksChange={() => {}}
    />
  );
}
