export interface SkillItem {
  skill: string;
  present: boolean;
}

export interface WeakBullet {
  original: string;
  issue: string;
  rewrite: string;
}

export interface AnalysisResult {
  ats_score: number;
  summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  skills_required: SkillItem[];
  weak_bullets: WeakBullet[];
  is_demo: boolean;
}
