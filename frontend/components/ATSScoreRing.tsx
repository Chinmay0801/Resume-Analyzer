"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import styles from "./ATSScoreRing.module.css";

interface Props {
  score: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: "#10b981", text: "#6ee7b7", label: "Excellent" };
  if (score >= 60) return { stroke: "#f59e0b", text: "#fcd34d", label: "Good" };
  return { stroke: "#f43f5e", text: "#fda4af", label: "Needs Work" };
}

export default function ATSScoreRing({ score }: Props) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const { stroke, text, label } = getScoreColor(score);

  const motionScore = useMotionValue(0);
  const dashOffset = useTransform(
    motionScore,
    [0, 100],
    [circumference, 0]
  );

  const displayScore = useRef(0);

  useEffect(() => {
    const controls = animate(motionScore, score, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => { displayScore.current = Math.round(v); },
    });
    return controls.stop;
  }, [score, motionScore]);

  return (
    <div className={styles.container}>
      <div className={styles.ringWrapper}>
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className={styles.svg}
        >
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
          />
          {/* Progress arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset }}
            transform="rotate(-90 100 100)"
            filter={`drop-shadow(0 0 8px ${stroke}88)`}
          />
        </svg>

        {/* Score label in centre */}
        <div className={styles.centerContent}>
          <motion.span
            className={styles.scoreNumber}
            style={{ color: text }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
          >
            <AnimatedNumber value={score} />
          </motion.span>
          <span className={styles.scorePercent} style={{ color: text }}>/ 100</span>
        </div>
      </div>

      <div className={styles.meta}>
        <p className={styles.label}>ATS Compatibility</p>
        <span className={styles.badge} style={{ color: text, background: `${stroke}18`, border: `1px solid ${stroke}44` }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, Math.round);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.6, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);

  return (
    <motion.span>{rounded}</motion.span>
  );
}
