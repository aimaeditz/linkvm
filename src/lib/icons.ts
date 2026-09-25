import React from 'react';
import {
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  ShoppingBag,
  Music,
  Video,
  Camera,
  BookOpen,
  Briefcase,
  Heart,
  Star,
  Coffee,
  MapPin,
  Send,
  MessageCircle,
  Twitch,
  Facebook,
  Radio,
  Share2,
  Bookmark,
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  Compass,
  Code,
  Laptop,
} from 'lucide-react';

export interface IconDefinition {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
}

export const AVAILABLE_ICONS: IconDefinition[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'twitter', name: 'Twitter / X', icon: Twitter },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'github', name: 'GitHub', icon: Github },
  { id: 'globe', name: 'Website', icon: Globe },
  { id: 'mail', name: 'Email', icon: Mail },
  { id: 'phone', name: 'Phone', icon: Phone },
  { id: 'calendar', name: 'Calendar / Book Call', icon: Calendar },
  { id: 'file-text', name: 'Resume / Document', icon: FileText },
  { id: 'shopping-bag', name: 'Store / Shop', icon: ShoppingBag },
  { id: 'music', name: 'Music / Spotify', icon: Music },
  { id: 'video', name: 'Video / Streams', icon: Video },
  { id: 'camera', name: 'Photography', icon: Camera },
  { id: 'book-open', name: 'Blog / Substack', icon: BookOpen },
  { id: 'briefcase', name: 'Portfolio / Work', icon: Briefcase },
  { id: 'heart', name: 'Support / Charity', icon: Heart },
  { id: 'star', name: 'Featured / Best', icon: Star },
  { id: 'coffee', name: 'Buy Me a Coffee', icon: Coffee },
  { id: 'map-pin', name: 'Location / Studio', icon: MapPin },
  { id: 'send', name: 'Telegram', icon: Send },
  { id: 'message-circle', name: 'WhatsApp', icon: MessageCircle },
  { id: 'twitch', name: 'Twitch', icon: Twitch },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'radio', name: 'Podcast', icon: Radio },
  { id: 'share-2', name: 'Community', icon: Share2 },
  { id: 'bookmark', name: 'Newsletter', icon: Bookmark },
  { id: 'sparkles', name: 'Special Project', icon: Sparkles },
  { id: 'link', name: 'General Link', icon: LinkIcon },
  { id: 'message-square', name: 'Discord', icon: MessageSquare },
  { id: 'compass', name: 'Explore', icon: Compass },
  { id: 'code', name: 'Developer Tool', icon: Code },
  { id: 'laptop', name: 'SaaS App', icon: Laptop },
];

export function getIconComponent(id?: string | null): React.ComponentType<{ className?: string; size?: number | string }> {
  if (!id) return LinkIcon;
  const match = AVAILABLE_ICONS.find((item) => item.id.toLowerCase() === id.toLowerCase());
  return match ? match.icon : LinkIcon;
}
