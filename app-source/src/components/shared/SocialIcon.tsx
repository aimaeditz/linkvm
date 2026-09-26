import React from 'react';

interface SocialIconProps {
  platform: string;
  size?: number; // actual inner icon size in px
  className?: string;
  color?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  size = 18,
  className = '',
  color = 'currentColor',
}) => {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  switch (platform.toLowerCase()) {
    case 'instagram':
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...props}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill={props.stroke === 'currentColor' ? 'none' : 'currentColor'} />
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg {...props} strokeWidth={1.5}>
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...props}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'github':
      return (
        <svg {...props}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...props} fill="none" strokeWidth={2}>
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...props}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg {...props}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case 'discord':
      return (
        <svg {...props} strokeWidth={1.5}>
          <path d="M18 6a10.42 10.42 0 0 0-4-1l-.48 1H10.48L10 5a10.42 10.42 0 0 0-4 1C3.33 10.22 3 14.78 4.22 18a11.11 11.11 0 0 0 4.24 2l1-1.53a7.43 7.43 0 0 1-2.22-1.12l.14-.11C9.62 18.1 11.81 19 12 19s2.38-.9 4.62-1.76l.14.11a7.43 7.43 0 0 1-2.22 1.12l1 1.53a11.11 11.11 0 0 0 4.24-2c1.22-3.22.89-7.78-1.78-12z" />
          <circle cx="9" cy="12" r="1" fill={props.stroke === 'currentColor' ? 'none' : 'currentColor'} />
          <circle cx="15" cy="12" r="1" fill={props.stroke === 'currentColor' ? 'none' : 'currentColor'} />
        </svg>
      );
    case 'twitch':
      return (
        <svg {...props}>
          <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9H9V6h2v5zm4 0h-2V6h2v5z" />
        </svg>
      );
    case 'spotify':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 10.5a12.3 12.3 0 0 1 8 0" />
          <path d="M9 13.2a9.3 9.3 0 0 1 6 0" />
          <path d="M9.5 15.8a6.3 6.3 0 0 1 5 0" />
        </svg>
      );
    case 'email':
      return (
        <svg {...props}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    default:
      // website
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
};
