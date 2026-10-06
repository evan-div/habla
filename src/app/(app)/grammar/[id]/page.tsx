import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GrammarDetail } from "@/components/grammar/GrammarDetail";
import { availableGrammar, getGrammar } from "@/content/grammar";

export function generateStaticParams() {
  return availableGrammar().map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getGrammar(id)?.title ?? "Grammar" };
}

export default async function GrammarTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concept = getGrammar(id);
  if (!concept || concept.status !== "available") notFound();
  return <GrammarDetail concept={concept} />;
}
