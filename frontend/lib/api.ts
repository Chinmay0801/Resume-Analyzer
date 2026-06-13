import { AnalysisResult } from "@/types/analysis";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeResume(
  file: File,
  jobDescription: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }

  return response.json();
}
