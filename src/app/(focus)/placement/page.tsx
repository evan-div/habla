import type { Metadata } from "next";
import { PlacementFlow } from "@/components/placement/PlacementFlow";

export const metadata: Metadata = { title: "Find your starting point" };

export default function PlacementPage() {
  return <PlacementFlow />;
}
