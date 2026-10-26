import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Download Pixmith",
  description: "Download Pixmith for macOS (Apple Silicon), Windows or Linux, with system requirements and install steps.",
};

export default function DownloadLayout({ children }: { children: ReactNode }) {
  return children;
}
