import type { Metadata } from "next";
import { VocabularyLibrary } from "@/components/vocabulary/VocabularyLibrary";

export const metadata: Metadata = { title: "Vocabulary" };

export default function VocabularyPage() {
  return <VocabularyLibrary />;
}
