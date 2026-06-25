from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from extractor import extract_text
from analyzer import analyze_resume

load_dotenv()

app = FastAPI(
    title="Resume Analyzer API",
    version="1.0.0",
    description="ATS Resume Analyzer powered by Gemini AI",
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Liveness check for Render / uptime monitors."""
    return {"status": "ok", "version": "1.0.0"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    job_description: str = Form(..., description="Full job description text"),
):
    """
    Analyze a resume against a job description.
    Returns ATS score, matched/missing keywords, skill gaps, and bullet rewrites.
    """
    # Validate file type by extension (content-type can be spoofed)
    filename = file.filename or ""
    if not (filename.lower().endswith(".pdf") or filename.lower().endswith(".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported.",
        )

    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty.",
        )

    content = await file.read()

    if len(content) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=413, detail="File size must be under 10 MB.")

    try:
        resume_text = extract_text(content, filename)
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Could not extract text from file: {str(e)}",
        )

    if not resume_text.strip():
        raise HTTPException(
            status_code=422,
            detail="No readable text found in the uploaded file. Ensure it is not scanned/image-only.",
        )

    try:
        result = await analyze_resume(resume_text, job_description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    return JSONResponse(content=result)
