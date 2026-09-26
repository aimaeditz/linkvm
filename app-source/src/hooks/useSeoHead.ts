import { useEffect } from 'react';
import { User } from '../types';
import { getSiteUrl } from '../lib/site';

export function useSeoHead(route: string, profileUser?: User | null) {
  useEffect(() => {
    const siteUrl = getSiteUrl();

    let title = 'LinkVM — All your links. One unified page.';
    let description = 'Consolidate your social media, portfolio, and digital content into one lightning-fast, beautifully designed page. 100% Free Forever.';
    let canonical = `${siteUrl}/`;
    let noindex = false;

    if (route === 'landing') {
      title = 'LinkVM — All your links. One unified page.';
      description = 'Consolidate your social media, portfolio, and digital content into one lightning-fast, beautifully designed page. 100% Free Forever.';
      canonical = `${siteUrl}/`;
    } else if (route === 'why-free') {
      title = 'Why Free Forever — LinkVM';
      description = 'Learn why LinkVM is 100% free forever with zero subscriptions, hidden fees, or locked features for creators.';
      canonical = `${siteUrl}/why-free`;
    } else if (route === 'about') {
      title = 'About — LinkVM';
      description = 'Discover the story and mission behind LinkVM, the lightning-fast, privacy-first bio link platform.';
      canonical = `${siteUrl}/about`;
    } else if (route === 'contact') {
      title = 'Contact — LinkVM';
      description = 'Get in touch with the LinkVM team for inquiries, feedback, or support.';
      canonical = `${siteUrl}/contact`;
    } else if (route === 'privacy') {
      title = 'Privacy Policy — LinkVM';
      description = "Read LinkVM's privacy policy and learn how we protect user data and respect privacy.";
      canonical = `${siteUrl}/privacy`;
    } else if (route === 'terms') {
      title = 'Terms of Service — LinkVM';
      description = 'Review the Terms of Service for LinkVM, the free bio link platform for creators.';
      canonical = `${siteUrl}/terms`;
    } else if (route === 'login') {
      title = 'Sign In — LinkVM';
      description = 'Sign in to your LinkVM account to manage your profile and bio links.';
      canonical = `${siteUrl}/login`;
      noindex = true;
    } else if (route === 'signup') {
      title = 'Claim Your Link — LinkVM';
      description = 'Create your free LinkVM profile in seconds. No credit card required.';
      canonical = `${siteUrl}/signup`;
      noindex = true;
    } else if (route === 'dashboard') {
      title = 'Dashboard — LinkVM';
      description = 'Manage your LinkVM profile, links, appearance, QR codes, and analytics.';
      canonical = `${siteUrl}/dashboard`;
      noindex = true;
    } else if (route === 'public_profile' && profileUser) {
      const name = profileUser.name || profileUser.username || 'Creator';
      const cleanUsername = profileUser.username ? profileUser.username.replace(/^[@$\-+!~]/, '') : '';
      title = `${name} — LinkVM`;
      description = profileUser.bio && profileUser.bio.trim()
        ? profileUser.bio.trim()
        : `Check out ${name}'s bio links, portfolio, social media, and digital content on LinkVM.`;
      canonical = `${siteUrl}/${cleanUsername}`;
    } else if (route === '404') {
      title = '404 - Page Not Found — LinkVM';
      description = 'The requested page or user profile could not be found on LinkVM.';
      canonical = `${siteUrl}/404`;
      noindex = true;
    }

    // Update document title
    document.title = title;

    // Helper function to update meta tags
    const updateMeta = (selector: string, key: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(key, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Helper function to update link canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical);

    // Meta Description & OG / Twitter
    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    updateMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    updateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'LinkVM');
    
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');

    // Robots meta tag for indexing vs noindex
    updateMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    );

  }, [route, profileUser]);
}
