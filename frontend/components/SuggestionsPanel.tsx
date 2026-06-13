"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnalysisResult } from "@/types/analysis";
import KeywordPill from "./KeywordPill";
import styles from "./SuggestionsPanel.module.css";

interface Props {
  result: AnalysisResult;
}

type Tab = "keywords" | "bullets" | "skills";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "keywords", label: "Keywords", emoji: "🔑" },
  { id: "bullets", label: "Bullet Rewrites", emoji: "✍️" },
  { id: "skills", label: "Skill Gaps", emoji: "📊" },
];

export default function SuggestionsPanel({ result }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("keywords");

  return (
    <div className={styles.container}>
      {/* Tab bar */}
      <div className={styles.tabBar} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div className={styles.tabIndicator} layoutId="tab-indicator" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className={styles.content}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "keywords" && (
            <div className={styles.keywordsSection}>
              <div className={styles.keywordGroup}>
                <h4 className={styles.groupTitle}>
                  <span className={styles.dot} style={{ background: "var(--success)" }} />
                  Matched Keywords ({result.matched_keywords.length})
                </h4>
                <div className={styles.pillGrid}>
                  {result.matched_keywords.map((kw) => (
                    <KeywordPill key={kw} keyword={kw} type="matched" />
                  ))}
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.keywordGroup}>
                <h4 className={styles.groupTitle}>
                  <span className={styles.dot} style={{ background: "var(--danger)" }} />
                  Missing Keywords ({result.missing_keywords.length})
                </h4>
                <p className={styles.groupHint}>Add these to your resume to improve ATS ranking.</p>
                <div className={styles.pillGrid}>
                  {result.missing_keywords.map((kw) => (
                    <KeywordPill key={kw} keyword={kw} type="missing" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bullets" && (
            <div className={styles.bulletsSection}>
              {result.weak_bullets.length === 0 ? (
                <div className={styles.emptyState}>
                  <span>🎉</span>
                  <p>No weak bullets found — your resume looks strong!</p>
                </div>
              ) : (
                result.weak_bullets.map((bullet, i) => (
                  <motion.div
                    key={i}
                    className={styles.bulletCard}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className={styles.bulletOriginal}>
                      <span className={styles.bulletLabel}>Original</span>
                      <p className={styles.bulletText}>&ldquo;{bullet.original}&rdquo;</p>
                    </div>
                    <div className={styles.bulletIssue}>
                      <span className={styles.issueIcon}>⚠️</span>
                      <p>{bullet.issue}</p>
                    </div>
                    <div className={styles.bulletRewrite}>
                      <span className={styles.bulletLabel} style={{ color: "var(--success)" }}>
                        ✨ Suggested Rewrite
                      </span>
                      <p className={styles.rewriteText}>{bullet.rewrite}</p>
                      <button
                        className={styles.copyBtn}
                        onClick={() => navigator.clipboard.writeText(bullet.rewrite)}
                        title="Copy rewrite"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div className={styles.skillsSection}>
              <div className={styles.skillColumns}>
                <div className={styles.skillGroup}>
                  <h4 className={styles.groupTitle}>
                    <span className={styles.dot} style={{ background: "var(--success)" }} />
                    You Have ({result.skills_required.filter(s => s.present).length})
                  </h4>
                  {result.skills_required
                    .filter((s) => s.present)
                    .map((s, i) => (
                      <motion.div
                        key={s.skill}
                        className={`${styles.skillItem} ${styles.skillPresent}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <span className={styles.skillCheck}>✓</span>
                        {s.skill}
                      </motion.div>
                    ))}
                </div>

                <div className={styles.skillGroup}>
                  <h4 className={styles.groupTitle}>
                    <span className={styles.dot} style={{ background: "var(--danger)" }} />
                    You Need ({result.skills_required.filter(s => !s.present).length})
                  </h4>
                  {result.skills_required
                    .filter((s) => !s.present)
                    .map((s, i) => (
                      <motion.div
                        key={s.skill}
                        className={`${styles.skillItem} ${styles.skillMissing}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <span className={styles.skillCheck}>✗</span>
                        {s.skill}
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
