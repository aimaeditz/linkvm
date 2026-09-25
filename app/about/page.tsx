import React from 'react';
import { AboutPage } from '@/components/info/AboutPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Built for creators who value simplicity and speed. Learn about the mission behind LinkVaultMe.',
};

export default function Page() {
  return <AboutPage />;
}
