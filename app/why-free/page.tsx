import React from 'react';
import { WhyFreePage } from '@/components/info/WhyFreePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why LinkVaultMe Is Free Forever',
  description: '100% Free forever. No subscriptions, no paywalls, no credit card required. Every feature unlocked for every creator.',
};

export default function Page() {
  return <WhyFreePage />;
}
