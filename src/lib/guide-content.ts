// Update this file whenever a feature changes. The Guide page renders directly from here.
export interface GuideSection {
  id: string;
  title: string;
  iconName: string;
  subtitle: string;
  content: string[];
  steps?: string[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'what-is-linkvm',
    title: 'What is LinkVM?',
    iconName: 'Sparkles',
    subtitle: 'One simple, powerful page for every link you share.',
    content: [
      'LinkVM is a modern, ultra-fast creator bio link platform designed to consolidate all your digital destinations into a single, beautiful landing page.',
      'Unlike legacy link-in-bio tools that lock features behind expensive paywalls or subscription tiers, LinkVM is 100% free forever. Every creator gets unlimited links, premium themes, vector QR codes, analytics, and custom branding at zero cost.',
      'Built for speed, privacy, and maximum conversion, LinkVM loads instantly on every device with clean, professional aesthetics.'
    ]
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    iconName: 'Rocket',
    subtitle: 'Launch your creator profile in under 60 seconds.',
    content: [
      'Getting started on LinkVM is straightforward and requires no credit cards or complex setup.'
    ],
    steps: [
      '1. Create your account with your email and secure password.',
      '2. Claim your unique username (e.g., linkvm.online/@yourname) or alternative share pattern.',
      '3. Add your first link, customize your profile bio and avatar, and publish your page instantly.'
    ]
  },
  {
    id: 'your-links',
    title: 'Your Links',
    iconName: 'Link2',
    subtitle: 'Manage, organize, and track your destination links.',
    content: [
      'Your links are the heart of your LinkVM profile. The Links dashboard allows you to add unlimited URLs with custom titles, rich Lucide icons, thumbnail images, and click counters.',
      'You can easily reorder links using drag-and-drop or move controls, temporarily hide links without deleting them, or schedule/highlight high-priority links with special badges.',
      'Every change is automatically synced and reflected in real-time on your live interactive phone preview.'
    ]
  },
  {
    id: 'themes-appearance',
    title: 'Themes & Appearance',
    iconName: 'Palette',
    subtitle: 'Handcrafted themes and professional customization controls.',
    content: [
      'Make your profile stand out with our theme library featuring 28 curated presets across 7 distinct aesthetic styles (Minimal, Neon, Glass, Gradient, Retro, Dark, and Vibrant).',
      'Fine-tune your layout with 5 header presets (Classic, Hero, Banner, Cutout, and Shape), custom accent colors, typography fonts, button shapes, hover effects, and playful stickers.',
      'Use the explicit Save and Cancel controls in the Appearance tab or rely on the automatic 800ms auto-save indicator.'
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    iconName: 'BarChart3',
    subtitle: 'Gain valuable insights into your audience engagement.',
    content: [
      'Track total profile views, individual link clicks, unique visitors, and click-through rates (CTR) with precision analytics.',
      'Filter engagement data by custom date ranges, analyze top-performing links, and export your analytics data to CSV for external reporting.',
      'Privacy-first design: LinkVM only tracks anonymous referral sources and device types. No personal tracking or country data is collected.'
    ]
  },
  {
    id: 'qr-code-invites',
    title: 'QR Code & Invites',
    iconName: 'QrCode',
    subtitle: 'Printable vector codes and creator referral networking.',
    content: [
      'Generate print-ready vector SVG and crisp PNG QR codes (512px, 1024px, 2048px) pointing directly to your creator profile, complete with custom colors and embedded center marks.',
      'Share your unique referral link (linkvm.online/r/{code}) to invite friends and fellow creators to LinkVM, with real-time signup tracking directly in your dashboard.'
    ]
  },
  {
    id: 'social-links',
    title: 'Social Links',
    iconName: 'Share2',
    subtitle: 'Connect your social networks in one unified row.',
    content: [
      'Add your favorite social profiles — X/Twitter, Instagram, YouTube, TikTok, GitHub, LinkedIn, Discord, Spotify, Twitch, and more.',
      'Built-in URL validation ensures clean links, and platform icons appear neatly formatted beneath your profile name and bio.'
    ]
  },
  {
    id: 'privacy-data',
    title: 'Privacy & Data',
    iconName: 'ShieldCheck',
    subtitle: 'Your data is secure, private, and entirely yours.',
    content: [
      'LinkVM gives you full control over your digital footprint. Control search engine indexing, hide view counters, or toggle anonymous analytics modes.',
      'You can export all your profile data and link items at any time with a single click, or securely delete your account and associated records through the Danger Zone.'
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    iconName: 'Settings',
    subtitle: 'Configure your profile, security, and preferences.',
    content: [
      'The Settings dashboard is organized into logical tabs: Profile (name, username, bio, avatar), Social Links, Account (email and password updates), Notifications, Privacy controls, and the Danger Zone for account deletion.'
    ]
  },
  {
    id: 'about-linkvm',
    title: 'About LinkVM',
    iconName: 'BookOpen',
    subtitle: 'Our mission, values, and commitment to creators.',
    content: [
      'LinkVM was built on a simple premise: creator tools should be lightning-fast, beautifully designed, and 100% free forever without hidden fees or upgrade prompts.',
      'We believe every creator deserves world-class infrastructure without worrying about subscription renewals or feature paywalls.'
    ]
  },
  {
    id: 'faq',
    title: 'FAQ',
    iconName: 'HelpCircle',
    subtitle: 'Honest answers to common questions about LinkVM.',
    content: [
      'Q: Is LinkVM really 100% free forever?\nA: Yes! There are no paid tiers, no trial periods, and no locked features. Everything is completely free.\n\nQ: Do I need a credit card to sign up?\nA: Never. No financial information is ever required.\n\nQ: Can I use my own custom domain?\nA: LinkVM provides lightning-fast edge hosting on linkvm.online and secure alternative URL patterns.\n\nQ: How is my data handled?\nA: Your data is securely stored and protected with modern cryptographic hashing. We never sell your data.\n\nQ: Can I export my data?\nA: Absolutely. You can download your profile data and analytics history at any time.\n\nQ: Are there any invasive trackers?\nA: No. We respect your privacy with clean, anonymous analytics.\n\nQ: Can I delete my account anytime?\nA: Yes, you have instant self-service account deletion in the Settings Danger Zone.'
    ]
  }
];
