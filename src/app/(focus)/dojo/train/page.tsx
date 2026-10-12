import type { Metadata } from "next";
import { DojoSession } from "@/components/dojo/DojoSession";

export const metadata: Metadata = { title: "Training · Conjugation Dojo" };

export default function DojoTrainPage() {
  return <DojoSession mode="train" />;
}
