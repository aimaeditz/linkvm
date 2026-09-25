import React from 'react';
import { TermsPage } from '@/components/info/TermsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'LinkVaultMe Terms of Service. Understand your rights and responsibilities when using our free platform.',
};

export default function Page() {
  return <TermsPage />;
}
