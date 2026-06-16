import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Cloud,
  Heart,
  HeartHandshake,
  type LucideIcon,
  MessagesSquare,
  Puzzle,
  Shield,
  Smile,
  Sparkles,
  Sun,
  Users,
  Users2,
  UsersRound,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  HeartHandshake,
  Sparkles,
  Sun,
  Shield,
  Users,
  UsersRound,
  Smile,
  BrainCircuit,
  PuzzlePiece: Puzzle,
  Users2,
  Heart,
  Cloud,
  BarChart3,
  MessagesSquare,
  BookOpenCheck,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}