"use client";

import styles from "./KeywordPill.module.css";

interface Props {
  keyword: string;
  type: "matched" | "missing";
}

export default function KeywordPill({ keyword, type }: Props) {
  return (
    <span className={`${styles.pill} ${type === "matched" ? styles.matched : styles.missing}`}>
      {type === "matched" ? "✓" : "+"} {keyword}
    </span>
  );
}
