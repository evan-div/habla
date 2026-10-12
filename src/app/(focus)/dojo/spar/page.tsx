import type { Metadata } from "next";
import { DojoSession } from "@/components/dojo/DojoSession";

export const metadata: Metadata = { title: "Sparring · Conjugation Dojo" };

export default function DojoSparPage() {
  return <DojoSession mode="spar" />;
}
