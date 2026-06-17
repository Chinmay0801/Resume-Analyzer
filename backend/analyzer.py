"""
Gemini API integration for resume analysis.
Falls back to a rich demo response when GEMINI_API_KEY is not set.
"""
import os
import json
import google.generativeai as genai

# ---------------------------------------------------------------------------
# Demo / mock response (used when no API key is configured)
# ---------------------------------------------------------------------------
DEMO_RESPONSE = {
    "ats_score": 72,
    "summary": (
        "Your resume shows strong technical foundations but misses several critical keywords "
        "and quantified achievements that ATS systems flag. Key gaps include cloud/DevOps skills "
        "and container technologies that are central to this role. Strengthening 3–4 bullet points "
        "with metrics and restructuring the skills section could push your score above 85."
    ),
    "matched_keywords": [
        "Python", "REST API", "Git", "SQL", "Machine Learning",
        "TensorFlow", "Flask", "Data Analysis", "NumPy", "Pandas",
    ],
    "missing_keywords": [
        "Kubernetes", "Docker", "CI/CD", "Microservices",
        "AWS", "System Design", "Agile/Scrum", "Redis", "GraphQL",
    ],
    "skills_required": [
        {"skill": "Python", "present": True},
        {"skill": "Docker", "present": False},
        {"skill": "Kubernetes", "present": False},
        {"skill": "AWS / Cloud", "present": False},
        {"skill": "CI/CD Pipelines", "present": False},
        {"skill": "REST APIs", "present": True},
        {"skill": "Machine Learning", "present": True},
        {"skill": "System Design", "present": False},
        {"skill": "Agile / Scrum", "present": False},
        {"skill": "SQL / NoSQL", "present": True},
        {"skill": "Git / Version Control", "present": True},
        {"skill": "Redis / Caching", "present": False},
    ],
    "weak_bullets": [
        {
            "original": "Worked on backend development for the company project",
            "issue": "Too vague — no tech stack, no scope, and zero impact metrics.",
            "rewrite": (
                "Engineered 4 RESTful microservices in Python/FastAPI serving 20K+ daily requests, "
                "reducing average response latency by 35% through async I/O and Redis caching."
            ),
        },
        {
            "original": "Helped with machine learning model",
            "issue": "Passive language ('helped'), no model type, dataset size, or accuracy numbers.",
            "rewrite": (
                "Developed and deployed a Random Forest classification model (91% accuracy) on a "
                "50K-sample dataset; integrated predictions via REST API into a production data pipeline."
            ),
        },
        {
            "original": "Made improvements to the existing codebase",
            "issue": "Completely unmeasurable — what kind of improvements, and what was the outcome?",
            "rewrite": (
                "Refactored a 15K-line Python monolith into a modular architecture, reducing "
                "code duplication by 40% and cutting new-engineer onboarding time from 2 weeks to 3 days."
            ),
        },
    ],
    "is_demo": True,
}

# ---------------------------------------------------------------------------
# Claude prompt
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """\
You are an expert ATS (Applicant Tracking System) resume analyzer and career coach.
Analyze the resume against the job description and return a structured JSON response.

Return ONLY valid JSON — no markdown, no explanation — matching this exact schema:
{
  "ats_score": <integer 0-100>,
  "summary": <string, 2-3 sentences, specific and actionable>,
  "matched_keywords": [<strings — keywords/skills present in BOTH resume and JD>],
  "missing_keywords": [<strings — important JD keywords absent from resume>],
  "skills_required": [
    {"skill": <string>, "present": <boolean>}
  ],
  "weak_bullets": [
    {
      "original": <exact bullet from resume that is weak>,
      "issue": <brief, direct explanation of what is wrong>,
      "rewrite": <improved version with strong action verbs and realistic metrics>
    }
  ]
}

Guidelines:
- ATS score: factor in keyword match %, quantification, active language, and relevance
- matched_keywords: 5-12 items
- missing_keywords: 4-10 critical items the resume lacks
- skills_required: 8-14 skills from the JD, each marked present/absent
- weak_bullets: identify 2-5 vague, passive, or unquantified bullets and rewrite them
- Be specific, direct, and brutally honest.
"""


async def analyze_resume(resume_text: str, job_description: str) -> dict:
    """Run resume analysis via Gemini or return demo data if no key is set."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key:
        return DEMO_RESPONSE

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT)

    user_message = f"""RESUME:
{resume_text}

---

JOB DESCRIPTION:
{job_description}

Analyze the resume against the job description and return the JSON."""

    response = model.generate_content(
        user_message,
        generation_config={"response_mime_type": "application/json"}
    )

    response_text = response.text.strip()

    # Safely extract JSON block in case model wraps it
    start = response_text.find("{")
    end = response_text.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError("Model did not return valid JSON.")
    json_str = response_text[start:end]

    result = json.loads(json_str)
    result["is_demo"] = False
    return result
