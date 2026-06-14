import { BrainCircuit, HeartHandshake, Sparkles, UsersRound, type LucideIcon } from "lucide-react";

export interface Service { slug: string; title: string; description: string; icon: LucideIcon; }

export const services: Service[] = [
  { slug: "individual-therapy", title: "Individual therapy", description: "A private, supportive space to understand patterns, build resilience, and move forward.", icon: HeartHandshake },
  { slug: "anxiety-therapy", title: "Anxiety support", description: "Practical, evidence-based strategies to reduce worry and feel more grounded.", icon: Sparkles },
  { slug: "couples-therapy", title: "Couples therapy", description: "Strengthen communication, repair trust, and reconnect with compassion.", icon: UsersRound },
  { slug: "adhd-assessment", title: "ADHD assessment", description: "A careful, affirming assessment process with clear recommendations.", icon: BrainCircuit },
];

export const faqs = [
  ["How do I know therapy is right for me?", "You do not need to be in crisis to benefit from therapy. An initial consultation can help us understand what you need and whether our approach feels right."],
  ["Are sessions confidential?", "Yes. Your privacy is fundamental. We explain the small number of legal and safety exceptions before care begins."],
  ["Do you offer online appointments?", "Yes. Secure online sessions and in-person appointments are both available, depending on your location and clinician."],
  ["What happens in the first session?", "We will discuss what brings you in, what you hope will change, and create a thoughtful plan together. You set the pace."],
] as const;