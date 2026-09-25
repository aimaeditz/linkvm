import React from 'react';
import { PrivacyPage } from '@/components/info/PrivacyPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'LinkVaultMe Privacy Policy. We do not sell your data or use third-party ad trackers.',
};

export default function Page() {
  return <PrivacyPage />;
}
