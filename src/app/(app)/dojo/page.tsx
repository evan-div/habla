import type { Metadata } from "next";
import { DojoHub } from "@/components/dojo/DojoHub";

export const metadata: Metadata = { title: "Conjugation Dojo" };

export default function DojoPage() {
  return <DojoHub />;
}
