import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { analyzeResume } from "../services/api";
import "./ResumeUpload.css";

/* ---------------------------------------------
   Constants
--------------------------------------------- */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["application/pdf"];
const ACCEPTED_EXT = [".pdf"];

const HIGHLIGHTS = [
  { Icon: Zap, label: "60-second analysis" },
  { Icon: Bot, label: "AI-powered feedback" },
  { Icon: ShieldCheck, label: "Private & secure" },
];

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const isPdf = (file) => {
  if (!file) return false;
  const typeOk = ACCEPTED_TYPES.includes(file.type);
  const extOk = ACCEPTED_EXT.some((ext) =>
    file.name?.toLowerCase().endsWith(ext)
  );
  return typeOk || extOk;
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  /* Validate + accept a file */
  const acceptFile = useCallback((incoming) => {
    if (!incoming) return;

    if (!isPdf(incoming)) {
      setError("Only PDF files are supported. Please upload a PDF resume.");
      return;
    }

    if (incoming.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 10 MB.");
      return;
    }

    setError("");
    setFile(incoming);
  }, []);

  /* Standard file picker */
  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    acceptFile(selected);
    // reset input value so re-uploading the same file triggers onChange
    event.target.value = "";
  };

  /* Drag & drop handlers */
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!loading) setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (loading) return;

    const dropped = event.dataTransfer.files?.[0];
    acceptFile(dropped);
  };

  const openPicker = () => {
    if (!loading) inputRef.current?.click();
  };

  const clearFile = (event) => {
    event?.stopPropagation();
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  /* Submit */
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume before analyzing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await analyzeResume(file);

      navigate("/results", {
        state: {
          analysis: result.analysis,
          resumeText: result.resumeText,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-page">
      {/* Ambient glow */}
      <div className="upload-glow" aria-hidden="true">
        <span className="upload-glow-a" />
        <span className="upload-glow-b" />
      </div>

      <div className="upload-card">
        {/* Header */}
        <header className="upload-header">
          <span className="upload-badge">
            <Sparkles className="upload-badge-icon" />
            AI Resume Analyzer
          </span>

          <h2 className="upload-title">Analyze Your Resume</h2>

          <p className="upload-description">
            Upload your resume and receive an ATS score, AI content feedback,
            job recommendations, and personalized learning suggestions — in
            seconds.
          </p>
        </header>

        {/* Dropzone */}
        <div
          className={`upload-dropzone${
            dragActive ? " is-dragging" : ""
          }${file ? " has-file" : ""}${error ? " has-error" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload resume PDF"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="upload-input"
            disabled={loading}
          />

          {!file ? (
            <>
              <div className="dropzone-icon-wrap">
                <Upload className="dropzone-icon" />
              </div>

              <h3 className="dropzone-title">
                {dragActive
                  ? "Drop your resume here"
                  : "Upload your resume"}
              </h3>

              <p className="dropzone-subtitle">
                Drag and drop your PDF, or{" "}
                <span className="dropzone-browse">browse files</span>
              </p>

              <div className="dropzone-meta">
                <span className="dropzone-meta-pill">PDF</span>
                <span className="dropzone-meta-dot" />
                <span>Max 10 MB</span>
              </div>
            </>
          ) : (
            <>
              <div className="file-icon-wrap">
                <FileText className="file-icon" />
              </div>

              <div className="file-info">
                <h3 className="file-name" title={file.name}>
                  {file.name}
                </h3>

                <div className="file-meta">
                  <span className="file-meta-size">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="file-meta-dot" />
                  <span className="file-meta-ready">
                    <CheckCircle2 className="file-meta-ready-icon" />
                    Ready to analyze
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="file-remove"
                onClick={clearFile}
                aria-label="Remove file"
                disabled={loading}
              >
                <X className="file-remove-icon" />
              </button>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="upload-error" role="alert">
            <AlertCircle className="upload-error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="upload-actions">
          {file && (
            <button
              type="button"
              className="upload-btn upload-btn--ghost"
              onClick={clearFile}
              disabled={loading}
            >
              Change file
            </button>
          )}

          <button
            type="button"
            className="upload-btn upload-btn--primary"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <Loader2 className="upload-btn-icon spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Resume
                <ArrowRight className="upload-btn-icon" />
              </>
            )}
          </button>
        </div>

        {/* Highlights */}
        <ul className="upload-highlights">
          {HIGHLIGHTS.map(({ Icon, label }) => (
            <li key={label} className="upload-highlight">
              <span className="upload-highlight-icon-wrap">
                <Icon className="upload-highlight-icon" />
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ResumeUpload;