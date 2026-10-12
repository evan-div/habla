import type { Metadata } from "next";
import { DojoSession } from "@/components/dojo/DojoSession";

export const metadata: Metadata = { title: "Belt test · Conjugation Dojo" };

export default function DojoBeltPage() {
  return <DojoSession mode="belt" />;
}
