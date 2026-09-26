import React, { useState, useEffect, useRef } from 'react';
import { User, LinkItem, ThemeConfig, SocialLinks, AnalyticsEvent } from './types';
import { StorageService, subscribeToStore } from './lib/storage';
import { isFirebaseConfigured, firebaseMissingError } from './lib/firebase';
import { extractUsernameFromUrl, normalizeUsername } from './lib/username-patterns';
import { AlertTriangle } from 'lucide-react';
import { Spinner } from './components/shared/Loader';

// Landing Page Components
import { Navbar } from './components/landing/Navbar';
import { Hero } from './components/landing/Hero';
import { TrustBar } from './components/landing/TrustBar';
import { Features } from './components/landing/Features';
import { HowItWorks } from './components/landing/HowItWorks';
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
import { useSeoHead } from './hooks/useSeoHead';

function getInitialRouteState(): { route: string; dashboardTab: string } {
  if (typeof window === 'undefined') {
    return { route: 'landing', dashboardTab: 'overview' };
  }

  const envMap = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
  const baseUrl = envMap?.BASE_URL || '/';
  const pathname = window.location.pathname;
  const hostname = window.location.hostname;

  const profileMatch = extractUsernameFromUrl(pathname, hostname, baseUrl);
  if (profileMatch) {
    return { route: 'resolving_profile', dashboardTab: 'overview' };
  }

  let clean = pathname;
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // ignore
  }

  const baseClean = baseUrl.replace(/\/$/, '');
  if (baseClean && clean.startsWith(baseClean)) {
    clean = clean.slice(baseClean.length);
  }
  if (clean.startsWith('/linkvm/')) {
    clean = clean.slice('/linkvm/'.length);
  } else if (clean === '/linkvm') {
    clean = '';
  }

  const segments = clean.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments.length === 0) {
    return { route: 'landing', dashboardTab: 'overview' };
  }

  const firstSegment = segments[0].toLowerCase();
  if (firstSegment === 'login') return { route: 'login', dashboardTab: 'overview' };
  if (firstSegment === 'signup') return { route: 'signup', dashboardTab: 'overview' };
  if (firstSegment === 'forgot-password') return { route: 'forgot-password', dashboardTab: 'overview' };
  if (firstSegment === 'about') return { route: 'about', dashboardTab: 'overview' };
  if (firstSegment === 'privacy') return { route: 'privacy', dashboardTab: 'overview' };
  if (firstSegment === 'terms') return { route: 'terms', dashboardTab: 'overview' };
  if (firstSegment === 'contact') return { route: 'contact', dashboardTab: 'overview' };
  if (firstSegment === 'why-free') return { route: 'why-free', dashboardTab: 'overview' };
  if (firstSegment === '404') return { route: '404', dashboardTab: 'overview' };
  if (firstSegment === 'dashboard') {
    const tab = segments.slice(1).join('/') || 'overview';
    return { route: 'dashboard', dashboardTab: tab };
  }

  return { route: 'resolving_profile', dashboardTab: 'overview' };
}

export default function App() {
  const initial = getInitialRouteState();
  const [route, setRoute] = useState<string>(initial.route);
  const [dashboardTab, setDashboardTab] = useState<string>(initial.dashboardTab);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState(!StorageService.isAuthReady());

  // App Data State (tied to real session and storage)
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [links, setLinks] = useState<LinkItem[]>(StorageService.getLinks());
  const [theme, setTheme] = useState<ThemeConfig>(StorageService.getTheme());
  const [socials, setSocials] = useState<SocialLinks>(StorageService.getSocials());
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>(StorageService.getAnalytics());

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const [, setSaveError] = useState<string | null>(null);
  const onRetryRef = useRef<(() => void) | null>(null);

  // Viewed profile state for dynamic /:username resolution
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileLinks, setProfileLinks] = useState<LinkItem[]>([]);
  const [profileTheme, setProfileTheme] = useState<ThemeConfig | null>(null);
  const [profileSocials, setProfileSocials] = useState<SocialLinks | null>(null);

  useSeoHead(route, profileUser);

  const refreshAllState = () => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    setLinks(StorageService.getLinks());
    setTheme(StorageService.getTheme());
    setSocials(StorageService.getSocials());
    setAnalytics(StorageService.getAnalytics());
  };

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      refreshAllState();
    });
    return () => unsubscribe();
  }, []);

  const getAppPath = (path: string): string => {
    const envMap = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
    const base = (envMap?.BASE_URL || '/').replace(/\/$/, '');
    const clean = path.startsWith('/') ? path : `/${path}`;
    return base ? `${base}${clean}` : clean;
  };

  const getCleanRoutePath = (pathname = window.location.pathname): string => {
    let path = pathname;
    try {
      path = decodeURIComponent(path);
    } catch {
      // ignore
    }
    const envMap = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
    const base = envMap?.BASE_URL || '/';
    if (base !== '/' && path.startsWith(base)) {
      path = path.slice(base.length);
    } else if (path.startsWith('/linkvm/')) {
      path = path.slice('/linkvm/'.length);
    } else if (path === '/linkvm') {
      path = '';
    }
    return path.replace(/^\/+|\/+$/g, '').trim();
  };

  const resolveRouteAndLoad = async (pathname = window.location.pathname) => {
    const envMap = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
    const baseUrl = envMap?.BASE_URL || '/';
    const hostname = window.location.hostname;

    // 1. Check if the URL is a public profile pattern (subdomain, /@username, /$username, /-username, /+username, /!username, /~username, /username)
    const profileMatch = extractUsernameFromUrl(pathname, hostname, baseUrl);
    if (profileMatch && profileMatch.username) {
      const targetUsername = profileMatch.username;

      // Check synchronous cache first
      const syncBundle = StorageService.findUserByUsername(targetUsername);
      if (syncBundle && profileUser && profileUser.username.toLowerCase() === targetUsername) {
        setRoute('public_profile');
        return;
      }

      setRoute((prev) => (prev === 'public_profile' && profileUser?.username.toLowerCase() === targetUsername ? prev : 'resolving_profile'));

      const bundle = await StorageService.getFullPublicProfileAsync(targetUsername);
      if (bundle && bundle.user) {
        setProfileUser(bundle.user);
        setProfileLinks(bundle.links);
        setProfileTheme(bundle.theme);
        setProfileSocials(bundle.socials);
        setRoute('public_profile');
      } else {
        setRoute('404');
      }
      return;
    }

    const cleanPath = getCleanRoutePath(pathname);
    const segments = cleanPath.split('/').filter(Boolean);

    if (segments.length === 0) {
      setRoute('landing');
      return;
    }

    const firstSegment = segments[0].toLowerCase();

    // Referral URL -> redirect to /login
    if (firstSegment === 'r' && segments.length >= 2) {
      const code = segments[1];
      if (code) {
        localStorage.setItem('linkvm_ref_code', code);
        document.cookie = `linkvm_ref_code=${code}; path=/; max-age=86400`;
        window.history.replaceState(null, '', getAppPath('/login'));
        setRoute('login');
        return;
      }
    }

    // Dashboard route guard - enforce signed-in user
    if (firstSegment === 'dashboard') {
      if (!StorageService.isAuthReady()) {
        await StorageService.authReadyPromise;
      }

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

      const tab = segments.slice(1).join('/');
      setRoute('dashboard');
      setDashboardTab(tab || 'overview');
      return;
    }

    // Auth routes (/login, /signup & /forgot-password) -> redirect to /dashboard if logged in
    if (firstSegment === 'login' || firstSegment === 'signup' || firstSegment === 'forgot-password') {
      if (StorageService.isSessionActive()) {
        window.history.replaceState(null, '', getAppPath('/dashboard'));
        setRoute('dashboard');
        setDashboardTab('overview');
      } else {
        setRoute(firstSegment);
      }
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

    // Fallback: try resolving single segment as potential username
    if (segments.length === 1) {
      const normalized = normalizeUsername(firstSegment);
      if (normalized) {
        setRoute((prev) => (prev === 'public_profile' && profileUser?.username.toLowerCase() === normalized ? prev : 'resolving_profile'));
        const bundle = await StorageService.getFullPublicProfileAsync(normalized);
        if (bundle && bundle.user) {
          setProfileUser(bundle.user);
          setProfileLinks(bundle.links);
          setProfileTheme(bundle.theme);
          setProfileSocials(bundle.socials);
          setRoute('public_profile');
          return;
        } else {
          setRoute('404');
          return;
        }
      }
    }

    setRoute('landing');
  };

  useEffect(() => {
    refreshAllState();

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('linkvm_ref_code', ref);
    }

    StorageService.authReadyPromise.then(() => {
      setIsAuthInitializing(false);
      refreshAllState();
      // If currently on auth/dashboard route, recheck
      const curPath = getCleanRoutePath(window.location.pathname);
      const first = curPath.split('/')[0]?.toLowerCase();
      if (first === 'dashboard' || first === 'login' || first === 'signup') {
        resolveRouteAndLoad();
      }
    });

    resolveRouteAndLoad();

    const handlePopState = () => {
      resolveRouteAndLoad();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogout = async () => {
    await StorageService.logout();
    refreshAllState();
    window.history.pushState(null, '', getAppPath('/'));
    resolveRouteAndLoad('/');
  };

  const handleLoginSuccess = () => {
    refreshAllState();
    window.history.pushState(null, '', getAppPath('/dashboard'));
    resolveRouteAndLoad('/dashboard');
  };

  const handleNavigate = (targetRoute: string) => {
    let newPath = '/';
    if (targetRoute === 'landing' || targetRoute === '') newPath = '/';
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

  if (route === 'resolving_profile') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4 p-6 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-xs">
          <Spinner size="md" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-bold text-slate-800 tracking-tight">Loading profile…</p>
          <p className="text-xs text-slate-400 font-mono">linkvm.online</p>
        </div>
      </div>
    );
  }

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
        onBackToDashboard={
          currentUser && currentUser.id === profileUser.id
            ? () => {
                window.history.pushState(null, '', getAppPath('/dashboard'));
                resolveRouteAndLoad('/dashboard');
              }
            : undefined
        }
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
                window.history.pushState(null, '', getAppPath('/login'));
                resolveRouteAndLoad('/login');
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
    if (isAuthInitializing) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-3">
          <Spinner size="lg" />
          <p className="text-xs font-semibold text-slate-500">Loading your LinkVM workspace…</p>
        </div>
      );
    }

    if (!currentUser) {
      window.history.replaceState(null, '', getAppPath('/login'));
      setRoute('login');
      return null;
    }

    return (
      <div className="flex h-screen w-full bg-slate-50/70 overflow-hidden font-sans">
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            currentTab={dashboardTab}
            onSelectTab={(tab) => handleNavigate(`dashboard_${tab}`)}
            user={currentUser}
            linksCount={links.length}
            onLogout={handleLogout}
            onViewPublic={() => handleNavigate(currentUser.username)}
          />
        </div>

        <MobileNav
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          currentTab={dashboardTab}
          onSelectTab={(tab) => {
            setMobileNavOpen(false);
            handleNavigate(`dashboard_${tab}`);
          }}
          user={currentUser}
          onLogout={handleLogout}
          onViewPublic={() => {
            setMobileNavOpen(false);
            handleNavigate(currentUser.username);
          }}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
          <Topbar
            title={dashboardTab.replace('-', ' ')}
            user={currentUser}
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onViewPublic={() => handleNavigate(currentUser.username)}
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
                user={currentUser}
                links={links}
                analytics={analytics}
                onNavigateTab={(tab) => handleNavigate(`dashboard_${tab}`)}
                onViewPublic={() => handleNavigate(currentUser.username)}
                onOpenShareModal={() => handleNavigate(currentUser.username)}
              />
            )}

            {dashboardTab === 'links' && (
              <LinksPage
                user={currentUser}
                links={links}
                onLinksChange={refreshAllState}
              />
            )}

            {dashboardTab === 'appearance' && (
              <AppearancePage
                user={currentUser}
                links={links}
                theme={theme}
                onThemeChange={refreshAllState}
              />
            )}

            {dashboardTab === 'analytics' && (
              <AnalyticsPage
                events={analytics}
                links={links}
                onViewPublic={() => handleNavigate(currentUser.username)}
              />
            )}

            {dashboardTab === 'qr-code' && (
              <QRCodePage user={currentUser} theme={theme} />
            )}

            {dashboardTab === 'settings' && (
              <SettingsPage
                user={currentUser}
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

            {dashboardTab === 'guide' && <GuidePage />}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {!isFirebaseConfigured && (
        <div className="w-full bg-rose-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 z-50 sticky top-0 shadow-md">
          <AlertTriangle size={15} className="shrink-0 text-white" />
          <span>{firebaseMissingError}</span>
        </div>
      )}
      <ScrollProgress />

      <Navbar
        onNavigate={handleNavigate}
        isLoggedIn={Boolean(currentUser && currentUser.email)}
      />

      <main className="flex-1 w-full">
        <Hero
          onStartFree={() => handleNavigate('login')}
          onSeeHowItWorks={() => handleNavigate('#how-it-works')}
        />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA onStartFree={() => handleNavigate('login')} />
      </main>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}
