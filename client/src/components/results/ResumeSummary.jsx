import { useEffect, useState } from "react";
import {
  FileText,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Quote,
  Layers,
} from "lucide-react";
import "./ResumeSummary.css";

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
const toArray = (value) => (Array.isArray(value) ? value : []);

/* ---------------------------------------------
   Component
--------------------------------------------- */
function ResumeSummary({ analysis }) {
  const summary = analysis?.summary || "";
  const strengths = toArray(analysis?.strengths);
  const weaknesses = toArray(analysis?.weaknesses);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const totalItems = strengths.length + weaknesses.length;

  return (
    <section className="resume-summary">
      {/* =========================================
          Header
      ========================================= */}
      <div className="summary-header">
        <div className="summary-header-left">
          <div className="summary-header-icon">
            <FileText className="summary-header-icon-svg" />
          </div>
          <div>
            <h2>Resume Summary</h2>
            <p>
              AI-generated overview of your resume&apos;s positioning,
              strengths, and growth areas.
            </p>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="summary-header-stats">
            <div className="summary-stat">
              <CheckCircle2 className="summary-stat-icon stat-emerald" />
              <div>
                <span className="summary-stat-value">
                  {strengths.length}
                </span>
                <span className="summary-stat-label">
                  {strengths.length === 1 ? "Strength" : "Strengths"}
                </span>
              </div>
            </div>

            <div className="summary-stat-divider" />

            <div className="summary-stat">
              <AlertTriangle className="summary-stat-icon stat-amber" />
              <div>
                <span className="summary-stat-value">
                  {weaknesses.length}
                </span>
                <span className="summary-stat-label">
                  {weaknesses.length === 1 ? "Gap" : "Gaps"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          AI Summary
      ========================================= */}
      <div className="summary-narrative">
        <div className="summary-narrative-header">
          <span className="summary-narrative-badge">
            <Sparkles className="summary-narrative-badge-icon" />
            AI Overview
          </span>

          <Quote className="summary-narrative-quote" />
        </div>

        <p className="summary-narrative-text">
          {summary || "No summary available for this resume yet."}
        </p>
      </div>

      {/* =========================================
          Strengths & Weaknesses
      ========================================= */}
      <div className="summary-columns">
        {/* Strengths */}
        <div className="summary-panel summary-panel--strengths">
          <div className="summary-panel-header">
            <div className="summary-panel-headline">
              <span className="summary-panel-icon-wrap strengths">
                <ThumbsUp className="summary-panel-icon" />
              </span>
              <div>
                <h3>Strengths</h3>
                <p>What&apos;s working well in your resume</p>
              </div>
            </div>

            <span className="summary-panel-count strengths">
              {strengths.length}
            </span>
          </div>

          {strengths.length === 0 ? (
            <div className="summary-panel-empty">
              <TrendingUp className="summary-panel-empty-icon" />
              <p>No strengths identified yet.</p>
            </div>
          ) : (
            <ul className="summary-list">
              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="summary-list-item"
                  style={{
                    animationDelay: mounted ? `${index * 60}ms` : "0ms",
                  }}
                >
                  <span className="summary-list-bullet strengths">
                    <CheckCircle2 className="summary-list-bullet-icon" />
                  </span>
                  <span className="summary-list-text">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weaknesses */}
        <div className="summary-panel summary-panel--weaknesses">
          <div className="summary-panel-header">
            <div className="summary-panel-headline">
              <span className="summary-panel-icon-wrap weaknesses">
                <AlertTriangle className="summary-panel-icon" />
              </span>
              <div>
                <h3>Areas to Improve</h3>
                <p>Opportunities to strengthen your resume</p>
              </div>
            </div>

            <span className="summary-panel-count weaknesses">
              {weaknesses.length}
            </span>
          </div>

          {weaknesses.length === 0 ? (
            <div className="summary-panel-empty">
              <CheckCircle2 className="summary-panel-empty-icon" />
              <p>No major gaps identified.</p>
            </div>
          ) : (
            <ul className="summary-list">
              {weaknesses.map((item, index) => (
                <li
                  key={index}
                  className="summary-list-item"
                  style={{
                    animationDelay: mounted ? `${index * 60}ms` : "0ms",
                  }}
                >
                  <span className="summary-list-bullet weaknesses">
                    <AlertTriangle className="summary-list-bullet-icon" />
                  </span>
                  <span className="summary-list-text">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResumeSummary;