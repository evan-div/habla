import type { Metadata } from "next";
import { GrammarIndex } from "@/components/grammar/GrammarIndex";

export const metadata: Metadata = { title: "Grammar" };

export default function GrammarPage() {
  return <GrammarIndex />;
}
