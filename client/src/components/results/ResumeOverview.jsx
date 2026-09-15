import { useEffect, useRef, useState } from "react";
import {
  Target,
  Award,
  TrendingUp,
  BarChart3,
  Sparkles,
  Layers,
} from "lucide-react";
import "./ResumeOverview.css";

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
const getTier = (score) => {
  if (score >= 85)
    return { id: "excellent", label: "Excellent" };
  if (score >= 70) return { id: "strong", label: "Strong" };
  if (score >= 50) return { id: "fair", label: "Fair" };
  return { id: "weak", label: "Needs Work" };
};

const getBarTone = (value) => {
  if (value >= 85) return "bar-excellent";
  if (value >= 70) return "bar-strong";
  if (value >= 50) return "bar-fair";
  return "bar-weak";
};

const formatKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

/* ---------------------------------------------
   Component
--------------------------------------------- */
function ResumeOverview({ analysis }) {
  const scores = analysis?.scores || {};
  const scoreEntries = Object.entries(scores);

  const overall = Math.max(
    0,
    Math.min(100, Number(analysis?.overallScore ?? 0))
  );
  const tier = getTier(overall);

  /* Animate the gauge value on mount / when overall changes */
  const [animated, setAnimated] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const duration = 1200;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setAnimated(Math.round(from + (overall - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [overall]);

  /* Bar reveal on mount */
  const [barsMounted, setBarsMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarsMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Radial gauge geometry */
  const SIZE = 200;
  const STROKE = 14;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const offset = CIRC - (animated / 100) * CIRC;

  return (
    <section className="resume-overview">
      {/* =========================================
          Overall score card
      ========================================= */}
      <div className={`overview-score-card tier-${tier.id}`}>
        <div className="overview-score-inner">
          {/* Header */}
          <div className="overview-score-header">
            <div className="overview-score-label">
              <Target className="overview-score-label-icon" />
              <span>Overall Resume Score</span>
            </div>

            <span className={`overview-tier-badge tier-${tier.id}`}>
              <Award className="overview-tier-icon" />
              {tier.label}
            </span>
          </div>

          {/* Gauge */}
          <div className="overview-gauge-wrap">
            <svg
              className="overview-gauge"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label={`Overall score ${overall} out of 100`}
            >
              <defs>
                <linearGradient
                  id="overviewGaugeGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="55%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>

                <filter
                  id="overviewGaugeGlow"
                  x="-25%"
                  y="-25%"
                  width="150%"
                  height="150%"
                >
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Track */}
              <circle
                className="overview-gauge-track"
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE}
                fill="none"
              />

              {/* Progress */}
              <circle
                className="overview-gauge-progress"
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                filter="url(#overviewGaugeGlow)"
              />
            </svg>

            <div className="overview-gauge-center">
              <span className="overview-gauge-value">{animated}</span>
              <span className="overview-gauge-max">/ 100</span>
            </div>
          </div>

          {/* Description */}
          <p className="overview-score-desc">
            Composite score based on ATS compatibility, content quality,
            skills, projects, and formatting.
          </p>

          {/* Mini metric row */}
          <div className="overview-score-metrics">
            <div className="overview-metric">
              <Layers className="overview-metric-icon stat-indigo" />
              <div>
                <span className="overview-metric-label">Categories</span>
                <span className="overview-metric-value">
                  {scoreEntries.length}
                </span>
              </div>
            </div>

            <div className="overview-metric-divider" />

            <div className="overview-metric">
              <TrendingUp className="overview-metric-icon stat-cyan" />
              <div>
                <span className="overview-metric-label">Tier</span>
                <span className="overview-metric-value">{tier.label}</span>
              </div>
            </div>

            <div className="overview-metric-divider" />

            <div className="overview-metric">
              <Sparkles className="overview-metric-icon stat-emerald" />
              <div>
                <span className="overview-metric-label">Status</span>
                <span className="overview-metric-value">
                  {overall >= 70 ? "On track" : "Improving"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          Score breakdown card
      ========================================= */}
      <div className="overview-breakdown-card">
        <div className="overview-breakdown-header">
          <div className="overview-breakdown-headline">
            <div className="overview-breakdown-icon-wrap">
              <BarChart3 className="overview-breakdown-icon" />
            </div>
            <div>
              <h2>Score Breakdown</h2>
              <p>Detailed performance across each evaluation category</p>
            </div>
          </div>

          <span className="overview-breakdown-count">
            {scoreEntries.length}{" "}
            {scoreEntries.length === 1 ? "metric" : "metrics"}
          </span>
        </div>

        {scoreEntries.length === 0 ? (
          <div className="overview-breakdown-empty">
            <div className="overview-breakdown-empty-icon-wrap">
              <Target className="overview-breakdown-empty-icon" />
            </div>
            <h3>No breakdown available</h3>
            <p>Score categories will appear here once the analysis runs.</p>
          </div>
        ) : (
          <div className="overview-breakdown-list">
            {scoreEntries.map(([key, value], idx) => {
              const numeric = Math.max(
                0,
                Math.min(100, Number(value) || 0)
              );
              const tone = getBarTone(numeric);

              return (
                <div
                  className="overview-bar-item"
                  key={key}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="overview-bar-header">
                    <span className="overview-bar-label">
                      {formatKey(key)}
                    </span>
                    <span className="overview-bar-value">
                      {numeric}
                      <span className="overview-bar-unit">%</span>
                    </span>
                  </div>

                  <div className="overview-bar-track">
                    <div
                      className={`overview-bar-fill ${tone}`}
                      style={{
                        width: barsMounted ? `${numeric}%` : "0%",
                        transitionDelay: `${idx * 70}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ResumeOverview;