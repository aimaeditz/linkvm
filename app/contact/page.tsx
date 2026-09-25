import React from 'react';
import { ContactPage } from '@/components/info/ContactPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support',
  description: 'Get in touch with the LinkVaultMe engineering and support team.',
};

export default function Page() {
  return <ContactPage />;
}
