import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50/70 overflow-hidden font-sans">
      {/* Sidebar on Desktop (w-64, hidden < lg) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          currentTab="overview"
          onSelectTab={() => {}}
          user={{
            id: 'demo',
            name: 'Creator',
            username: 'creator',
            email: 'creator@linkvm.online',
            bio: '',
            avatarUrl: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          linksCount={0}
          onLogout={() => {}}
          onViewPublic={() => {}}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        <Topbar
          title="Dashboard"
          user={{
            id: 'demo',
            name: 'Creator',
            username: 'creator',
            email: 'creator@linkvm.online',
            bio: '',
            avatarUrl: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          onOpenMobileNav={() => {}}
          onViewPublic={() => {}}
          onNavigateSettings={() => {}}
          onNavigateTab={() => {}}
          onLogout={() => {}}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 2xl:px-12 2xl:py-12 w-full min-w-0 max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
