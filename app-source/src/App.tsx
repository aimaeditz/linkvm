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

  const getAppPath = (path: string): string => {
    const base = ((import.meta as any)?.env?.BASE_URL || '/').replace(/\/$/, '');
    const clean = path.startsWith('/') ? path : `/${path}`;
    return base ? `${base}${clean}` : clean;
  };

  const getCleanRoutePath = (pathname = window.location.pathname): string => {
    const base = ((import.meta as any)?.env?.BASE_URL || '/');
    let path = pathname;
    if (base !== '/' && path.startsWith(base)) {
      path = path.slice(base.length);
    } else if (path.startsWith('/linkvm/')) {
      path = path.slice('/linkvm/'.length);
    } else if (path === '/linkvm') {
      path = '';
    }
    return path.replace(/^\//, '').trim();
  };

  const resolveRouteAndLoad = (pathname = window.location.pathname) => {
    const cleanPath = getCleanRoutePath(pathname);

    // Check subdomain user first
    const hostname = window.location.hostname;
    const hostParts = hostname.split('.');
    let targetUsername = '';

    const isDevOrStandard = 
      hostname.includes('run.app') || 
      hostname.includes('localhost') || 
      hostname.includes('127.0.0.1') || 
      hostname.includes('web.app') || 
      hostname.includes('github.dev') ||
      hostname.includes('vercel.app') ||
      hostname.includes('gitpod.io');

    if (!isDevOrStandard && hostParts.length > 2 && hostParts[0] !== 'www' && hostParts[0] !== 'linkvm') {
      targetUsername = hostParts[0];
    }

    if (targetUsername) {
      const normalizedSubdomain = normalizeUsername(targetUsername);
      const found = StorageService.findUserByUsername(normalizedSubdomain);
      if (found) {
        setProfileUser(found);
        setProfileLinks(StorageService.getLinksForUser(found.id));
        setProfileTheme(StorageService.getThemeForUser(found.id));
        setProfileSocials(StorageService.getSocialsForUser(found.id));
        setRoute('public_profile');
      } else {
        setRoute('404');
      }
      return;
    }

    // Static pages and reserved paths
    const RESERVED_PATHS = new Set([
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
      '404',
      'index.html'
    ]);

    const segments = cleanPath.split('/').filter(Boolean);

    // If path is empty (root route)
    if (segments.length === 0) {
      setRoute('landing');
      return;
    }

    const firstSegment = segments[0];

    // Check if the path starts with /r/{code} (short referral URL)
    if (firstSegment === 'r' && segments.length >= 2) {
      const code = segments[1];
      if (code) {
        localStorage.setItem('linkvm_ref_code', code);
        document.cookie = `linkvm_ref_code=${code}; path=/; max-age=86400`;
        window.history.replaceState(null, '', getAppPath(`/signup?ref=${code}`));
        setRoute('signup');
        return;
      }
    }

    // Check if the path is a dashboard nested path
    if (firstSegment === 'dashboard') {
      if (!StorageService.isSessionActive()) {
        window.history.replaceState(null, '', getAppPath('/login'));
        setRoute('login');
        return;
      }
      
      if (segments.length === 1) {
        setRoute('dashboard');
        setDashboardTab('overview');
        return;
      }
      
      // It's a dashboard nested tab, like dashboard/links
      const tab = segments.slice(1).join('/');
      setRoute('dashboard');
      setDashboardTab(tab || 'overview');
      return;
    }

    // Check other static routes
    if (firstSegment === 'login') {
      if (StorageService.isSessionActive()) {
        window.history.replaceState(null, '', getAppPath('/dashboard'));
        setRoute('dashboard');
        setDashboardTab('overview');
      } else {
        setRoute('login');
      }
      return;
    }

    if (firstSegment === 'signup') {
      if (StorageService.isSessionActive()) {
        window.history.replaceState(null, '', getAppPath('/dashboard'));
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

    // Public profile route (/{username}):
    // - Match only when the first segment is NOT in the reserved list above.
    // - Normalize the segment by stripping leading @, $, -, +, !, ~ characters, lowercasing, and trimming.
    // - If the normalized username exists in the local user store -> render the public profile.
    // - If it does not exist -> render the 404 "Profile Not Found" page (only if segments.length === 1, indicating username lookup)
    if (!RESERVED_PATHS.has(firstSegment.toLowerCase())) {
      if (segments.length === 1) {
        const normalized = normalizeUsername(firstSegment);
        const userFound = StorageService.findUserByUsername(normalized);
        if (userFound) {
          setProfileUser(userFound);
          setProfileLinks(StorageService.getLinksForUser(userFound.id));
          setProfileTheme(StorageService.getThemeForUser(userFound.id));
          setProfileSocials(StorageService.getSocialsForUser(userFound.id));
          setRoute('public_profile');
          return;
        } else {
          setRoute('404');
          return;
        }
      }
    }

    // Default fallback:
    // - If the path cannot be matched to any known route -> render the Landing page (NOT the 404 page).
    setRoute('landing');
  };

  useEffect(() => {
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
    window.history.pushState(null, '', getAppPath('/'));
    resolveRouteAndLoad('/');
  };

  const handleLoginSuccess = () => {
    refreshAllState();
    window.history.pushState(null, '', getAppPath('/dashboard'));
    resolveRouteAndLoad('/dashboard');
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
      const cleanCurrent = getCleanRoutePath(window.location.pathname);
      if (cleanCurrent !== '') {
        window.history.pushState(null, '', getAppPath(`/${targetRoute}`));
        resolveRouteAndLoad('/');
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
      newPath = `/${targetRoute}`;
    }

    const appPath = getAppPath(newPath);
    window.history.pushState(null, '', appPath);
    resolveRouteAndLoad(appPath);
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
          window.history.pushState(null, '', getAppPath('/dashboard'));
          resolveRouteAndLoad('/dashboard');
        } : undefined}
        onNavigateHome={() => {
          window.history.pushState(null, '', getAppPath('/'));
          resolveRouteAndLoad('/');
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
                window.history.pushState(null, '', getAppPath('/'));
                resolveRouteAndLoad('/');
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                window.history.pushState(null, '', getAppPath('/signup'));
                resolveRouteAndLoad('/signup');
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
