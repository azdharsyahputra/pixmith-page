import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pixmith guide: every tool, step by step",
  description: "How to use each Pixmith tool: drawing, selection, shapes, color and ink, animation, tilemaps, Godot export and Live Link.",
};

export default function GuideLayout({ children }: { children: ReactNode }) {
  return children;
}
