import {
  BookOpen, Briefcase, Brain, Calendar, Compass, Flag, Flame, Gem, GraduationCap, Hand, CircleHelp,
  Library, MapPin, Medal, Users, Clock, MessageCircle, PartyPopper, Repeat, ShoppingBag, Sparkles, Swords, Target, Trophy, Utensils, Zap,
  type LucideIcon,
} from "lucide-react";

/** String keys used in content/config → icons. Unknown keys fall back to Sparkles. */
const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  briefcase: Briefcase,
  brain: Brain,
  calendar: Calendar,
  compass: Compass,
  flag: Flag,
  flame: Flame,
  gem: Gem,
  "graduation-cap": GraduationCap,
  hand: Hand,
  "help-circle": CircleHelp,
  library: Library,
  "map-pin": MapPin,
  medal: Medal,
  "message-circle": MessageCircle,
  "party-popper": PartyPopper,
  repeat: Repeat,
  "shopping-bag": ShoppingBag,
  sparkles: Sparkles,
  swords: Swords,
  target: Target,
  trophy: Trophy,
  users: Users,
  clock: Clock,
  utensils: Utensils,
  zap: Zap,
};

export function Icon({ name, size = 20, className, strokeWidth = 2.2 }: { name: string; size?: number; className?: string; strokeWidth?: number }) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
