import React, { useState, useEffect, useRef } from 'react';
import { User, LinkItem, ThemeConfig, SocialLinks, AnalyticsEvent } from './types';
import { StorageService } from './lib/storage';

// Landing Page Components
import { Navbar } from './components/landing/Navbar';
import { Hero } from './components/landing/Hero';
import { TrustBar } from './components/landing/TrustBar';
import { Features } from './components/landing/Features';
import { HowItWorks } from './components/landing/HowItWorks';
import { WhyFree } from './components/landing/WhyFree';
import { Testimonials } from './components/landing/Testimonials';
import { FAQ } from './components/landing/FAQ';
import { FinalCTA } from './components/landing/FinalCTA';
import { Footer } from './components/landing/Footer';

// Auth Components
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';

// Dashboard Components
import { Sidebar } from './components/dashboard/Sidebar';
import { Topbar } from './components/dashboard/Topbar';
import { MobileNav } from './components/dashboard/MobileNav';
import { OverviewPage } from './components/dashboard/OverviewPage';
import { LinksPage } from './components/dashboard/LinksPage';
import { AppearancePage } from './components/dashboard/AppearancePage';
import { AnalyticsPage } from './components/dashboard/AnalyticsPage';
import { QRCodePage } from './components/dashboard/QRCodePage';
import { SettingsPage } from './components/dashboard/SettingsPage';
import { GuidePage } from './components/dashboard/GuidePage';

// Public & Info Views
import { PublicProfilePage } from './components/public/PublicProfilePage';
import { AboutPage } from './components/info/AboutPage';
import { PrivacyPage } from './components/info/PrivacyPage';
import { TermsPage } from './components/info/TermsPage';
import { ContactPage } from './components/info/ContactPage';
import { WhyFreePage } from './components/info/WhyFreePage';
import { ScrollProgress } from './components/shared/ScrollProgress';
import { BackToTop } from './components/shared/BackToTop';

const BASE = import.meta.env.BASE_URL || '/';

function getNormalizedPath(): string {
  let path = window.location.pathname;
  const baseWithoutTrailing = BASE !== '/' && BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  if (BASE !== '/' && path.startsWith(BASE)) {
    path = path.slice(BASE.length);
  } else if (BASE !== '/' && (path === baseWithoutTrailing || path.startsWith(baseWithoutTrailing + '/'))) {
    path = path.slice(baseWithoutTrailing.length);
  }
  // Ensure leading slash
  if (!path.startsWith('/')) path = '/' + path;
  // Remove trailing slash except for root
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

function getAppUrl(to: string): string {
  const cleanTo = to.startsWith('/') ? to : '/' + to;
  return BASE === '/' ? cleanTo : BASE.replace(/\/$/, '') + cleanTo;
}

export default function App() {
  const [route, setRoute] = useState<string>('landing');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // App Data State (tied to real session and storage)
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [links, setLinks] = useState<LinkItem[]>(StorageService.getLinks());
  const [theme, setTheme] = useState<ThemeConfig>(StorageService.getTheme());
  const [socials, setSocials] = useState<SocialLinks>(StorageService.getSocials());
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>(StorageService.getAnalytics());

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const [saveError, setSaveError] = useState<string | null>(null);
  const onRetryRef = useRef<(() => void) | null>(null);

  // Viewed profile state for proper /:username dynamic resolution (including prefix patterns and subdomain)
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileLinks, setProfileLinks] = useState<LinkItem[]>([]);
  const [profileTheme, setProfileTheme] = useState<ThemeConfig | null>(null);
  const [profileSocials, setProfileSocials] = useState<SocialLinks | null>(null);

  const refreshAllState = () => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    setLinks(StorageService.getLinks());
    setTheme(StorageService.getTheme());
    setSocials(StorageService.getSocials());
    setAnalytics(StorageService.getAnalytics());
  };

  const normalizeUsername = (username: string): string => {
    let cleaned = username.trim().toLowerCase();
    while (cleaned.length > 0 && ['@', '$', '-', '+', '!', '~'].includes(cleaned[0])) {
      cleaned = cleaned.substring(1);
    }
    return cleaned.trim();
  };

  const navigate = (to: string) => {
    const url = getAppUrl(to);
    window.history.pushState(null, '', url);
    resolveRouteAndLoad();
  };

  const resolveRouteAndLoad = () => {
    const path = getNormalizedPath();

    // 1. Root ALWAYS renders Landing, no exceptions.
    if (path === '/' || path === '') {
      setRoute('landing');
      return;
    }

    // 2. Reserved routes — never treated as usernames.
    const RESERVED = new Set([
      'login',
      'signup',
      'forgot-password',
      'dashboard',
      'why-free',
      'about',
      'contact',
      'privacy',
      'terms',
      'invite',
      'r',
      '404',
      'assets',
      'favicon.ico',
      'manifest.json',
      'index.html',
    ]);

    const segments = path.split('/').filter(Boolean);
    const firstSegment = (segments[0] || '').toLowerCase();

    // 3. /dashboard/* handling
    if (path.startsWith('/dashboard') || firstSegment === 'dashboard') {
      if (!StorageService.isSessionActive()) {
        window.history.replaceState(null, '', getAppUrl('/login'));
        setRoute('login');
        return;
      }

      if (segments.length <= 1) {
        setRoute('dashboard');
        setDashboardTab('overview');
        return;
      }

      const tab = segments.slice(1).join('/');
      setRoute('dashboard');
      setDashboardTab(tab || 'overview');
      return;
    }

    // 4. /r/{code} referral handling
    if (path.startsWith('/r/') || (firstSegment === 'r' && segments.length >= 2)) {
      const code = segments[1];
      if (code) {
        localStorage.setItem('linkvm_ref_code', code);
        document.cookie = `linkvm_ref_code=${code}; path=/; max-age=86400`;
        window.history.replaceState(null, '', getAppUrl(`/signup?ref=${code}`));
        setRoute('signup');
        return;
      }
    }

    // Reserved routes matching
    if (RESERVED.has(firstSegment)) {
      if (firstSegment === 'login') {
        if (StorageService.isSessionActive()) {
          window.history.replaceState(null, '', getAppUrl('/dashboard'));
          setRoute('dashboard');
          setDashboardTab('overview');
        } else {
          setRoute('login');
        }
        return;
      }
      if (firstSegment === 'signup') {
        if (StorageService.isSessionActive()) {
          window.history.replaceState(null, '', getAppUrl('/dashboard'));
          setRoute('dashboard');
          setDashboardTab('overview');
        } else {
          setRoute('signup');
        }
        return;
      }
      if (firstSegment === 'forgot-password') {
        setRoute('forgot-password');
        return;
      }
      if (firstSegment === 'about') {
        setRoute('about');
        return;
      }
      if (firstSegment === 'privacy') {
        setRoute('privacy');
        return;
      }
      if (firstSegment === 'terms') {
        setRoute('terms');
        return;
      }
      if (firstSegment === 'contact') {
        setRoute('contact');
        return;
      }
      if (firstSegment === 'why-free') {
        setRoute('why-free');
        return;
      }
      if (firstSegment === '404') {
        setRoute('404');
        return;
      }
      setRoute('landing');
      return;
    }

    // 5. Public profile /{username} — only if NOT reserved and looks like a username
    const username = normalizeUsername(firstSegment);
    if (username && /^[a-z0-9_-]{3,30}$/.test(username)) {
      const user = StorageService.findUserByUsername(username);
      if (user) {
        setProfileUser(user);
        setProfileLinks(StorageService.getLinksForUser(user.id));
        setProfileTheme(StorageService.getThemeForUser(user.id));
        setProfileSocials(StorageService.getSocialsForUser(user.id));
        setRoute('public_profile');
        return;
      }
    }

    // 6. Otherwise → 404 profile not found
    setRoute('404');
  };

  useEffect(() => {
    // Sanity check: guaranteed root render on first paint
    const initialPath = getNormalizedPath();
    if (initialPath === '' || initialPath === '/') {
      if (BASE !== '/' && window.location.pathname !== BASE) {
        window.history.replaceState(null, '', BASE);
      }
    }

    refreshAllState();
    
    // Capture referral code if present in the URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('linkvm_ref_code', ref);
    }

    // Initialize Routing
    resolveRouteAndLoad();

    const handlePopState = () => {
      resolveRouteAndLoad();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogout = () => {
    StorageService.logout();
    refreshAllState();
    navigate('/');
  };

  const handleLoginSuccess = () => {
    refreshAllState();
    navigate('/dashboard');
  };

  // Quick navigation handler
  const handleNavigate = (targetRoute: string) => {
    let newPath = '/';
    if (targetRoute === 'landing') newPath = '/';
    else if (targetRoute === 'login') newPath = '/login';
    else if (targetRoute === 'signup') newPath = '/signup';
    else if (targetRoute === 'forgot-password') newPath = '/forgot-password';
    else if (targetRoute === 'about') newPath = '/about';
    else if (targetRoute === 'privacy') newPath = '/privacy';
    else if (targetRoute === 'terms') newPath = '/terms';
    else if (targetRoute === 'contact') newPath = '/contact';
    else if (targetRoute === 'why-free') newPath = '/why-free';
    else if (targetRoute === 'dashboard') newPath = '/dashboard';
    else if (targetRoute.startsWith('dashboard_')) {
      const tab = targetRoute.replace('dashboard_', '');
      newPath = `/dashboard/${tab}`;
    } else if (targetRoute.startsWith('#')) {
      // It's a hash anchor
      const normalized = getNormalizedPath();
      if (normalized !== '/') {
        navigate('/' + targetRoute);
        setTimeout(() => {
          const el = document.querySelector(targetRoute);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(targetRoute);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    } else if (targetRoute === 'pricing') {
      newPath = '/why-free';
    } else {
      newPath = targetRoute.startsWith('/') ? targetRoute : `/${targetRoute}`;
    }

    navigate(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe fallback user object if in preview/dashboard
  const activeUser: User = currentUser || {
    id: 'guest',
    name: 'Creator',
    username: 'creator',
    email: 'creator@linkvm.online',
    bio: 'Consolidate all your links into one place.',
    avatarUrl: '',
    headerLayout: 'classic',
    titleStyle: 'text',
    titleFont: 'Inter',
    altTitleFont: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Render Page Based on Route
  if (route === 'login') {
    return <LoginPage onSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
  }

  if (route === 'signup') {
    return <SignupPage onSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
  }

  if (route === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={handleNavigate} />;
  }

  if (route === 'about') {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  if (route === 'privacy') {
    return <PrivacyPage onNavigate={handleNavigate} />;
  }

  if (route === 'terms') {
    return <TermsPage onNavigate={handleNavigate} />;
  }

  if (route === 'contact') {
    return <ContactPage onNavigate={handleNavigate} />;
  }

  if (route === 'why-free') {
    return <WhyFreePage onNavigate={handleNavigate} />;
  }

  if (route === 'public_profile' && profileUser) {
    return (
      <PublicProfilePage
        user={profileUser}
        links={profileLinks}
        theme={profileTheme || theme}
        socials={profileSocials || socials}
        onBackToDashboard={currentUser && currentUser.id === profileUser.id ? () => {
          navigate('/dashboard');
        } : undefined}
        onNavigateHome={() => {
          navigate('/');
        }}
      />
    );
  }

  if (route === '404') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center font-sans">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-large flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-2xl mb-6 shadow-sm">
            404
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile Not Found</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            The LinkVM page you are looking for does not exist. It might have been deleted, or the creator may have changed their username.
          </p>
          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100/80 mt-6 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Good News!</span>
            <span className="text-xs text-slate-700 font-bold">This username is currently available!</span>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => {
                navigate('/');
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                navigate('/signup');
              }}
              className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Claim Handle
            </button>
          </div>
        </div>
        <div className="text-[11px] font-bold text-slate-400 mt-6">
          Created by AiMAEditz
        </div>
      </div>
    );
  }

  if (route === 'dashboard') {
    return (
      <div className="flex h-screen w-full bg-slate-50/70 overflow-hidden font-sans">
        {/* Desktop Fixed Sidebar (7 items) */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            currentTab={dashboardTab}
            onSelectTab={(tab) => handleNavigate(`dashboard_${tab}`)}
            user={activeUser}
            linksCount={links.length}
            onLogout={handleLogout}
            onViewPublic={() => handleNavigate(activeUser.username)}
          />
        </div>

        {/* Mobile Slide-in Drawer with Framer Motion */}
        <MobileNav
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          currentTab={dashboardTab}
          onSelectTab={(tab) => {
            setMobileNavOpen(false);
            handleNavigate(`dashboard_${tab}`);
          }}
          user={activeUser}
          onLogout={handleLogout}
          onViewPublic={() => {
            setMobileNavOpen(false);
            handleNavigate(activeUser.username);
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
          <Topbar
            title={dashboardTab.replace('-', ' ')}
            user={activeUser}
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onViewPublic={() => handleNavigate(activeUser.username)}
            onNavigateSettings={() => handleNavigate('dashboard_settings')}
            onNavigateTab={(tab) => handleNavigate(`dashboard_${tab}`)}
            onLogout={handleLogout}
            saveStatus={saveStatus}
            onRetrySave={() => {
              if (onRetryRef.current) {
                onRetryRef.current();
              }
            }}
          />

          <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 2xl:px-12 2xl:py-12 w-full min-w-0 max-w-none">
            {dashboardTab === 'overview' && (
              <OverviewPage
                user={activeUser}
                links={links}
                analytics={analytics}
                onNavigateTab={(tab) => handleNavigate(`dashboard_${tab}`)}
                onViewPublic={() => handleNavigate(activeUser.username)}
                onOpenShareModal={() => handleNavigate(activeUser.username)}
              />
            )}

            {dashboardTab === 'links' && (
              <LinksPage
                user={activeUser}
                links={links}
                onLinksChange={refreshAllState}
              />
            )}

            {dashboardTab === 'appearance' && (
              <AppearancePage
                user={activeUser}
                links={links}
                theme={theme}
                onThemeChange={refreshAllState}
              />
            )}

            {dashboardTab === 'analytics' && (
              <AnalyticsPage
                events={analytics}
                links={links}
                onViewPublic={() => handleNavigate(activeUser.username)}
              />
            )}

            {dashboardTab === 'qr-code' && (
              <QRCodePage user={activeUser} theme={theme} />
            )}

            {dashboardTab === 'settings' && (
              <SettingsPage
                user={activeUser}
                socials={socials}
                onUserUpdate={refreshAllState}
                onLogout={handleLogout}
                links={links}
                theme={theme}
                setSaveStatus={setSaveStatus}
                setSaveError={setSaveError}
                onRetryRef={onRetryRef}
              />
            )}

            {dashboardTab === 'guide' && (
              <GuidePage />
            )}
          </main>
        </div>
      </div>
    );
  }

  // Default: Landing Page
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <ScrollProgress />

      <Navbar
        onNavigate={handleNavigate}
        isLoggedIn={Boolean(currentUser && currentUser.email)}
      />

      <main className="flex-1 w-full">
        <Hero
          onStartFree={() => handleNavigate('signup')}
          onSeeHowItWorks={() => handleNavigate('#how-it-works')}
        />
        <TrustBar />
        <Features />
        <HowItWorks />
        <WhyFree onStartFree={() => handleNavigate('signup')} />
        <Testimonials />
        <FAQ />
        <FinalCTA onStartFree={() => handleNavigate('signup')} />
      </main>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}
