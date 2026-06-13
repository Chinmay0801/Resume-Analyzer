"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UploadZone from "@/components/UploadZone";
import { analyzeResume } from "@/lib/api";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please upload your resume."); return; }
    if (!jd.trim()) { setError("Please paste the job description."); return; }

    setError(null);
    setLoading(true);

    try {
      const result = await analyzeResume(file, jd);
      // Store result in sessionStorage and navigate to results
      sessionStorage.setItem("analysis_result", JSON.stringify(result));
      router.push("/results");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className={styles.page}>
        {/* Nav */}
        <nav className={styles.nav}>
          <div className={styles.navLogo}>
            <span className={styles.logoIcon}>⚡</span>
            <span>ResumeAI</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            GitHub ↗
          </a>
        </nav>

        {/* Hero */}
        <div className="container">
          <motion.div
            className={styles.hero}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.heroBadge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className={styles.heroBadgeDot} />
              Powered by Claude AI
            </motion.div>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              Beat the ATS,<br />
              <span className={styles.heroGradient}>Land the Interview</span>
            </motion.h1>

            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Upload your resume and paste any job description to instantly get your ATS score,
              keyword gaps, skill analysis, and AI-powered bullet rewrites.
            </motion.p>

            {/* Stats */}
            <motion.div
              className={styles.stats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {[
                { value: "< 5s", label: "Analysis time" },
                { value: "0–100", label: "ATS Score" },
                { value: "Free", label: "Always" },
              ].map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <a href="/results?demo=true" className={styles.demoLink}>
                👁 View live demo →
              </a>
            </motion.div>
          </motion.div>

          {/* Upload Form */}
          <motion.form
            className={`glass-card ${styles.form}`}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className={styles.formSection}>
              <label className={styles.formLabel}>
                <span className={styles.labelNum}>1</span>
                Upload Your Resume
              </label>
              <UploadZone file={file} onFileChange={setFile} />
            </div>

            <div className={styles.divider} />

            <div className={styles.formSection}>
              <label className={styles.formLabel} htmlFor="jd-input">
                <span className={styles.labelNum}>2</span>
                Paste Job Description
              </label>
              <textarea
                id="jd-input"
                className={styles.textarea}
                placeholder="Paste the full job description here — requirements, responsibilities, skills…"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={8}
              />
              <p className={styles.charCount}>{jd.length} characters</p>
            </div>

            {error && (
              <motion.div
                className={styles.errorBox}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            <button
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={loading}
              id="analyze-btn"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Analyzing your resume…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  Analyze Resume
                </>
              )}
            </button>

            <p className={styles.disclaimer}>
              No data is stored. Analysis runs in real-time via Claude AI.
            </p>
          </motion.form>

          {/* How it works */}
          <motion.section
            className={styles.howItWorks}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>How it works</h2>
            <div className={styles.steps}>
              {[
                { icon: "📄", title: "Upload Resume", desc: "Drop your PDF or DOCX resume" },
                { icon: "📋", title: "Paste JD", desc: "Add the job description you're targeting" },
                { icon: "🤖", title: "AI Analysis", desc: "Claude reads both and runs a deep analysis" },
                { icon: "🎯", title: "Get Results", desc: "Score, gaps, rewrites — ready in seconds" },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  className={`glass-card ${styles.step}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Built with FastAPI + Next.js + Claude AI &nbsp;·&nbsp; Deployed on Render + Vercel</p>
        </footer>
      </div>
    </div>
  );
}
