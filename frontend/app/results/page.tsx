"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/types/analysis";
import ATSScoreRing from "@/components/ATSScoreRing";
import SkillMatchChart from "@/components/SkillMatchChart";
import SuggestionsPanel from "@/components/SuggestionsPanel";
import styles from "./page.module.css";
import { Suspense } from "react";

const DEMO_DATA: AnalysisResult = {
  ats_score: 72,
  summary:
    "Your resume shows strong technical foundations but misses several critical keywords and quantified achievements that ATS systems flag. Key gaps include cloud/DevOps skills and container technologies central to this role. Strengthening 3-4 bullet points with metrics could push your score above 85.",
  matched_keywords: ["Python", "REST API", "Git", "SQL", "Machine Learning", "TensorFlow", "Flask", "Data Analysis", "NumPy", "Pandas"],
  missing_keywords: ["Kubernetes", "Docker", "CI/CD", "Microservices", "AWS", "System Design", "Agile/Scrum", "Redis", "GraphQL"],
  skills_required: [
    { skill: "Python", present: true },
    { skill: "Docker", present: false },
    { skill: "Kubernetes", present: false },
    { skill: "AWS / Cloud", present: false },
    { skill: "CI/CD Pipelines", present: false },
    { skill: "REST APIs", present: true },
    { skill: "Machine Learning", present: true },
    { skill: "System Design", present: false },
    { skill: "Agile / Scrum", present: false },
    { skill: "SQL / NoSQL", present: true },
    { skill: "Git / Version Control", present: true },
    { skill: "Redis / Caching", present: false },
  ],
  weak_bullets: [
    {
      original: "Worked on backend development for the company project",
      issue: "Too vague - no tech stack, no scope, and zero impact metrics.",
      rewrite: "Engineered 4 RESTful microservices in Python/FastAPI serving 20K+ daily requests, reducing average response latency by 35% through async I/O and Redis caching.",
    },
    {
      original: "Helped with machine learning model",
      issue: "Passive language, no model type, dataset size, or accuracy numbers.",
      rewrite: "Developed and deployed a Random Forest classification model (91% accuracy) on a 50K-sample dataset; integrated predictions via REST API into a production data pipeline.",
    },
    {
      original: "Made improvements to the existing codebase",
      issue: "Completely unmeasurable - what kind of improvements, and what was the outcome?",
      rewrite: "Refactored a 15K-line Python monolith into a modular architecture, reducing code duplication by 40% and cutting new-engineer onboarding time from 2 weeks to 3 days.",
    },
  ],
  is_demo: true,
};

function ResultsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // ?demo=true → load mock data instantly (no backend needed)
    if (searchParams.get("demo") === "true") {
      setResult(DEMO_DATA);
      return;
    }
    const raw = sessionStorage.getItem("analysis_result");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setResult(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router, searchParams]);

  if (!result) {
    return (
      <div className={styles.loading}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        <p>Loading results…</p>
      </div>
    );
  }

  const matchedCount = result.matched_keywords.length;
  const missingCount = result.missing_keywords.length;
  const totalKeywords = matchedCount + missingCount;

  return (
    <div className="page-wrapper">
      <div className={styles.page}>
        {/* Nav */}
        <nav className={styles.nav}>
          <button
            className={styles.backBtn}
            onClick={() => router.push("/")}
          >
            ← Back
          </button>
          <div className={styles.navTitle}>Analysis Results</div>
          {result.is_demo && (
            <span className="badge badge-demo">Demo Mode</span>
          )}
        </nav>

        <div className="container-wide">
          {/* Demo banner */}
          {result.is_demo && (
            <motion.div
              className={styles.demoBanner}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>🔄</span>
              <p>
                <strong>Demo Mode</strong> — This is a sample analysis.
                Add your <code>ANTHROPIC_API_KEY</code> to the backend <code>.env</code> file to analyze real resumes.
              </p>
            </motion.div>
          )}

          {/* Summary */}
          <motion.div
            className={`glass-card ${styles.summaryCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className={styles.summaryText}>{result.summary}</p>
          </motion.div>

          {/* Top row: Score + quick stats */}
          <div className={styles.topRow}>
            {/* Score ring */}
            <motion.div
              className={`glass-card ${styles.scoreCard}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring" }}
            >
              <ATSScoreRing score={result.ats_score} />
            </motion.div>

            {/* Quick stat cards */}
            <div className={styles.quickStats}>
              {[
                {
                  label: "Keywords Matched",
                  value: matchedCount,
                  total: totalKeywords,
                  color: "var(--success)",
                  bg: "var(--success-bg)",
                  icon: "✓",
                },
                {
                  label: "Keywords Missing",
                  value: missingCount,
                  total: totalKeywords,
                  color: "var(--danger)",
                  bg: "var(--danger-bg)",
                  icon: "✗",
                },
                {
                  label: "Bullets to Rewrite",
                  value: result.weak_bullets.length,
                  total: null,
                  color: "var(--warning)",
                  bg: "var(--warning-bg)",
                  icon: "✍",
                },
                {
                  label: "Skills Assessed",
                  value: result.skills_required.length,
                  total: null,
                  color: "var(--accent-light)",
                  bg: "rgba(124,58,237,0.12)",
                  icon: "📊",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className={`glass-card ${styles.statCard}`}
                  style={{ "--stat-color": stat.color, "--stat-bg": stat.bg } as React.CSSProperties}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                >
                  <div className={styles.statIcon}>{stat.icon}</div>
                  <div className={styles.statValue}>
                    {stat.value}
                    {stat.total !== null && (
                      <span className={styles.statDenominator}>/{stat.total}</span>
                    )}
                  </div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skill Match Chart */}
          <motion.div
            className={`glass-card ${styles.chartCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SkillMatchChart skills={result.skills_required} />
          </motion.div>

          {/* Suggestions Panel */}
          <motion.div
            className={styles.panelWrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <SuggestionsPanel result={result} />
          </motion.div>

          {/* CTA */}
          <motion.div
            className={`glass-card ${styles.ctaCard}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <h3 className={styles.ctaTitle}>Ready to apply?</h3>
            <p className={styles.ctaText}>
              Incorporate the missing keywords and rewritten bullets, then re-analyze to push your score above 85.
            </p>
            <button
              className="btn-primary"
              onClick={() => router.push("/")}
              id="analyze-again-btn"
            >
              ← Analyze Another Resume
            </button>
          </motion.div>
        </div>

        <footer className={styles.footer}>
          <p>ResumeAI &nbsp;·&nbsp; Built with FastAPI + Next.js + Claude AI</p>
        </footer>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "var(--text-secondary)" }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        <p>Loading results…</p>
      </div>
    }>
      <ResultsPageInner />
    </Suspense>
  );
}
