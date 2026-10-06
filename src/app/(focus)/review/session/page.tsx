import type { Metadata } from "next";
import { ReviewSession } from "@/components/review/ReviewSession";

export const metadata: Metadata = { title: "Review session" };

export default function ReviewSessionPage() {
  return <ReviewSession mode="review" />;
}
