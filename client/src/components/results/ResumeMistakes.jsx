import { useMemo, useState } from "react";
import {
  Search,
  SpellCheck,
  Repeat,
  FileText,
  Ruler,
  Calendar,
  ClipboardList,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Lightbulb,
  AlertCircle,
  BookOpen,
  Info,
} from "lucide-react";
import "./ResumeMistakes.css";

/* ---------------------------------------------
   Category config
--------------------------------------------- */
const CATEGORIES = [
  { key: "grammar", title: "Grammar", Icon: SpellCheck },
  { key: "spelling", title: "Spelling", Icon: BookOpen },
  { key: "repeatedWords", title: "Repeated Words", Icon: Repeat },
  { key: "weakSentences", title: "Weak Sentences", Icon: FileText },
  { key: "formatting", title: "Formatting", Icon: Ruler },
  { key: "dateFormat", title: "Date Format", Icon: Calendar },
  { key: "longBulletPoints", title: "Long Bullet Points", Icon: ClipboardList },
  { key: "missingAchievements", title: "Missing Achievements", Icon: Trophy },
];

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
const getScoreTone = (score) => {
  if (score >= 85) return "excellent";
  if (score >= 70) return "strong";
  if (score >= 50) return "fair";
  return "weak";
};

const getSeverity = (count) => {
  if (count === 0) return "clean";
  if (count <= 2) return "low";
  if (count <= 5) return "medium";
  return "high";
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
function ResumeMistakes({ analysis }) {
  const mistakes = analysis?.mistakes || {};
  const score = Number(mistakes.score ?? 0);
  const total = Number(mistakes.total ?? 0);
  const scoreTone = getScoreTone(score);

  /* Compute per-category counts once */
  const categories = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = Array.isArray(mistakes[cat.key])
        ? mistakes[cat.key]
        : [];
      return { ...cat, items, count: items.length };
    });
  }, [mistakes]);

  const cleanCategories = categories.filter((c) => c.count === 0).length;
  const issueCategories = categories.length - cleanCategories;

  /* Which category is expanded */
  const [openKey, setOpenKey] = useState(null);

  const toggle = (key) =>
    setOpenKey((prev) => (prev === key ? null : key));

  /* Radial score geometry */
  const SIZE = 120;
  const STROKE = 10;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const offset = CIRC - (Math.min(100, Math.max(0, score)) / 100) * CIRC;

  return (
    <section className="resume-mistakes">
      {/* =========================================
          Header + score
      ========================================= */}
      <div className="mistakes-header">
        <div className="mistakes-header-left">
          <div className="mistakes-header-icon">
            <Search className="mistakes-header-icon-svg" />
          </div>
          <div>
            <h2>Resume Mistakes</h2>
            <p>
              AI-identified issues that may reduce your resume&apos;s
              clarity, credibility, and ATS performance.
            </p>
          </div>
        </div>

        <div className="mistakes-score">
          <div className="mistakes-score-ring">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label={`Mistake score ${score} out of 100`}
            >
              <defs>
                <linearGradient
                  id="mistakesScoreGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient
                  id="mistakesScoreGradientMid"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient
                  id="mistakesScoreGradientLow"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>

              <circle
                className="mistakes-score-track"
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE}
                fill="none"
              />

              <circle
                className={`mistakes-score-progress tone-${scoreTone}`}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            </svg>

            <div className="mistakes-score-center">
              <span className="mistakes-score-value">{score}</span>
              <span className="mistakes-score-max">/100</span>
            </div>
          </div>

          <div className="mistakes-score-meta">
            <span className={`mistakes-score-badge tone-${scoreTone}`}>
              {scoreTone === "excellent" && "Clean"}
              {scoreTone === "strong" && "Good"}
              {scoreTone === "fair" && "Needs Work"}
              {scoreTone === "weak" && "Critical"}
            </span>
            <span className="mistakes-score-count">
              {total} {total === 1 ? "issue" : "issues"} found
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          Summary strip
      ========================================= */}
      <div className="mistakes-summary">
        <div className="mistakes-summary-item">
          <div className="mistakes-summary-icon-wrap summary-clean">
            <CheckCircle2 className="mistakes-summary-icon" />
          </div>
          <div>
            <span className="mistakes-summary-value">
              {cleanCategories}
            </span>
            <span className="mistakes-summary-label">
              Clean {cleanCategories === 1 ? "category" : "categories"}
            </span>
          </div>
        </div>

        <div className="mistakes-summary-divider" />

        <div className="mistakes-summary-item">
          <div className="mistakes-summary-icon-wrap summary-issue">
            <AlertTriangle className="mistakes-summary-icon" />
          </div>
          <div>
            <span className="mistakes-summary-value">
              {issueCategories}
            </span>
            <span className="mistakes-summary-label">
              {issueCategories === 1 ? "Category" : "Categories"} with issues
            </span>
          </div>
        </div>

        <div className="mistakes-summary-divider" />

        <div className="mistakes-summary-item">
          <div className="mistakes-summary-icon-wrap summary-total">
            <ClipboardList className="mistakes-summary-icon" />
          </div>
          <div>
            <span className="mistakes-summary-value">
              {categories.length}
            </span>
            <span className="mistakes-summary-label">
              Total checks
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          Category grid
      ========================================= */}
      <div className="mistakes-grid">
        {categories.map(({ key, title, Icon, items, count }) => {
          const severity = getSeverity(count);
          const isOpen = openKey === key;
          const hasIssues = count > 0;

          return (
            <article
              key={key}
              className={`mistake-category severity-${severity}${
                isOpen ? " is-open" : ""
              }`}
            >
              <button
                type="button"
                className="mistake-category-header"
                onClick={() => hasIssues && toggle(key)}
                aria-expanded={isOpen}
                disabled={!hasIssues}
              >
                <div className="mistake-category-headline">
                  <span className="mistake-category-icon-wrap">
                    <Icon className="mistake-category-icon" />
                  </span>

                  <div className="mistake-category-title-block">
                    <h3 className="mistake-category-title">{title}</h3>
                    <span className="mistake-category-subtitle">
                      {hasIssues
                        ? `${count} ${count === 1 ? "issue" : "issues"} detected`
                        : "No issues found"}
                    </span>
                  </div>
                </div>

                <div className="mistake-category-meta">
                  <span
                    className={`mistake-category-count severity-${severity}`}
                  >
                    {count}
                  </span>

                  {hasIssues && (
                    <ChevronDown
                      className={`mistake-category-chevron${
                        isOpen ? " rotate" : ""
                      }`}
                    />
                  )}
                </div>
              </button>

              {/* Body */}
              {hasIssues && (
                <div className="mistake-category-body">
                  <div className="mistake-list">
                    {items.map((item, index) => {
                      const isString = typeof item === "string";

                      return (
                        <div className="mistake-item" key={index}>
                          <div className="mistake-item-marker">
                            <AlertCircle className="mistake-item-marker-icon" />
                          </div>

                          {isString ? (
                            <p className="mistake-item-text">{item}</p>
                          ) : (
                            <div className="mistake-item-blocks">
                              {item.issue && (
                                <div className="mistake-item-block block-issue">
                                  <span className="mistake-item-block-label">
                                    <AlertCircle className="mistake-item-block-icon" />
                                    Issue
                                  </span>
                                  <p>{item.issue}</p>
                                </div>
                              )}

                              {item.example && (
                                <div className="mistake-item-block block-example">
                                  <span className="mistake-item-block-label">
                                    <BookOpen className="mistake-item-block-icon" />
                                    Example
                                  </span>
                                  <p>{item.example}</p>
                                </div>
                              )}

                              {item.suggestion && (
                                <div className="mistake-item-block block-suggestion">
                                  <span className="mistake-item-block-label">
                                    <Lightbulb className="mistake-item-block-icon" />
                                    Suggestion
                                  </span>
                                  <p>{item.suggestion}</p>
                                </div>
                              )}

                              {item.explanation && (
                                <div className="mistake-item-block block-why">
                                  <span className="mistake-item-block-label">
                                    <Info className="mistake-item-block-icon" />
                                    Why it matters
                                  </span>
                                  <p>{item.explanation}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ResumeMistakes;