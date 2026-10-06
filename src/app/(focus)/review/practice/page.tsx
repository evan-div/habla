import type { Metadata } from "next";
import { ReviewSession } from "@/components/review/ReviewSession";

export const metadata: Metadata = { title: "Practice session" };

export default function PracticeSessionPage() {
  return <ReviewSession mode="practice" />;
}
