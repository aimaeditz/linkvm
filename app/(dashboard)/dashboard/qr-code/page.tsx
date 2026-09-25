'use client';

import React from 'react';
import { QRCodePage } from '@/components/dashboard/QRCodePage';

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
  return <QRCodePage user={dummyUser} />;
}
