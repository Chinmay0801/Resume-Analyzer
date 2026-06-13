"use client";

import { useCallback, useState } from "react";
import styles from "./UploadZone.module.css";

interface Props {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const ACCEPTED = [".pdf", ".docx"];

export default function UploadZone({ file, onFileChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (f: File) => {
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (!ext || !["pdf", "docx"].includes(ext)) {
        setError("Only PDF and DOCX files are supported.");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setError("File must be under 10 MB.");
        return;
      }
      setError(null);
      onFileChange(f);
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div className={styles.wrapper}>
      <label
        htmlFor="resume-upload"
        className={`${styles.zone} ${dragging ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {file ? (
          <div className={styles.fileInfo}>
            <span className={styles.fileIcon}>📄</span>
            <div>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>
                {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp;
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    onFileChange(null);
                  }}
                >
                  Remove
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.uploadIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className={styles.primaryText}>
              {dragging ? "Drop your resume here" : "Drag & drop your resume"}
            </p>
            <p className={styles.secondaryText}>
              or <span className={styles.browseLink}>browse files</span>
            </p>
            <p className={styles.hint}>PDF or DOCX · max 10 MB</p>
          </div>
        )}
      </label>
      <input
        id="resume-upload"
        type="file"
        accept={ACCEPTED.join(",")}
        className={styles.hiddenInput}
        onChange={onInputChange}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
