"use client";

import { motion } from "framer-motion";
import { SkillItem } from "@/types/analysis";
import styles from "./SkillMatchChart.module.css";

interface Props {
  skills: SkillItem[];
}

export default function SkillMatchChart({ skills }: Props) {
  const present = skills.filter((s) => s.present).length;
  const total = skills.length;
  const matchPct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Skill Match</h3>
        <span className={styles.summary}>
          {present} / {total} skills matched &nbsp;·&nbsp;
          <strong style={{ color: matchPct >= 70 ? "var(--success)" : "var(--warning)" }}>
            {matchPct}%
          </strong>
        </span>
      </div>

      <div className={styles.list}>
        {skills.map((skill, i) => (
          <motion.div
            key={skill.skill}
            className={styles.row}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
          >
            <div className={styles.skillName}>{skill.skill}</div>
            <div className={styles.barTrack}>
              <motion.div
                className={`${styles.barFill} ${skill.present ? styles.present : styles.absent}`}
                initial={{ width: 0 }}
                animate={{ width: skill.present ? "100%" : "18%" }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span
              className={`${styles.status} ${skill.present ? styles.statusPresent : styles.statusAbsent}`}
            >
              {skill.present ? "✓ Present" : "✗ Missing"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
