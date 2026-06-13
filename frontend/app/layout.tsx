import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume Analyzer — ATS Score & Keyword Gap Analysis",
  description:
    "Upload your resume and paste a job description to instantly get your ATS compatibility score, missing keywords, skill gaps, and AI-powered bullet rewrites.",
  keywords: [
    "resume analyzer",
    "ATS score",
    "keyword gap",
    "job description",
    "resume optimization",
    "career tool",
  ],
  openGraph: {
    title: "Resume Analyzer — ATS Score & Keyword Gap Analysis",
    description:
      "Instantly analyze your resume against any job description with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
