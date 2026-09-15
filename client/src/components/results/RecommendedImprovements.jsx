import { useMemo, useState } from "react";
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Target,
  FileText,
  Award,
  Layout,
  TrendingUp,
  Hash,
  Star,
} from "lucide-react";
import "./RecommendedImprovements.css";

/* ---------------------------------------------
   Category + priority detection
   (keyword-based heuristic so we don't need
   to change the incoming analysis shape)
--------------------------------------------- */
const CATEGORY_RULES = [
  {
    id: "content",
    label: "Content",
    Icon: FileText,
    keywords: [
      "bullet",
      "content",
      "describe",
      "detail",
      "summar",
      "objective",
      "statement",
      "paragraph",
      "wording",
      "phrase",
    ],
  },
  {
    id: "metrics",
    label: "Metrics & Impact",
    Icon: TrendingUp,
    keywords: [
      "metric",
      "measur",
      "quantif",
      "number",
      "impact",
      "result",
      "achievement",
      "percent",
      "%",
      "increase",
      "decrease",
    ],
  },
  {
    id: "keywords",
    label: "Keywords",
    Icon: Hash,
    keywords: [
      "keyword",
      "ats",
      "skill",
      "technology",
      "tool",
      "stack",
      "match",
    ],
  },
  {
    id: "structure",
    label: "Structure",
    Icon: Layout,
    keywords: [
      "section",
      "order",
      "layout",
      "format",
      "structure",
      "header",
      "font",
      "spacing",
      "length",
    ],
  },
  {
    id: "polish",
    label: "Polish",
    Icon: Sparkles,
    keywords: [
      "grammar",
      "typo",
      "spell",
      "tone",
      "voice",
      "clean",
      "consistent",
      "tense",
    ],
  },
];

const PRIORITY_RULES = [
  {
    level: "high",
    weight: 3,
    keywords: ["critical", "must", "essential", "missing", "no ", "lacks", "add"],
  },
  {
    level: "medium",
    weight: 2,
    keywords: ["should", "recommend", "consider", "improve", "enhance"],
  },
  {
    level: "low",
    weight: 1,
    keywords: ["could", "optional", "nice", "polish", "fine-tune"],
  },
];

const detectCategory = (text) => {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    const score = rule.keywords.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  return best || CATEGORY_RULES[0]; // fallback to Content
};

const detectPriority = (text) => {
  const lower = text.toLowerCase();
  let best = PRIORITY_RULES[1]; // default medium
  let bestWeight = 0;

  for (const rule of PRIORITY_RULES) {
    const score = rule.keywords.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    );
    const weight = score * rule.weight;
    if (weight > bestWeight) {
      bestWeight = weight;
      best = rule;
    }
  }

  return best.level;
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
function RecommendedImprovements({ analysis }) {
  const improvements = Array.isArray(analysis?.improvements)
    ? analysis.improvements
    : [];

  const [filter, setFilter] = useState("all");
  const [completed, setCompleted] = useState(() => new Set());
  const [copiedIndex, setCopiedIndex] = useState(null);

  /* Enrich with category + priority */
  const enriched = useMemo(
    () =>
      improvements.map((text, index) => ({
        id: index,
        text,
        category: detectCategory(text),
        priority: detectPriority(text),
      })),
    [improvements]
  );

  /* Group by category for the filter bar */
  const categoryCounts = useMemo(() => {
    const map = new Map();
    enriched.forEach((item) => {
      map.set(item.category.id, (map.get(item.category.id) || 0) + 1);
    });
    return map;
  }, [enriched]);

  const visible =
    filter === "all"
      ? enriched
      : enriched.filter((i) => i.category.id === filter);

  const completedCount = completed.size;
  const progress = improvements.length
    ? Math.round((completedCount / improvements.length) * 100)
    : 0;

  const toggleComplete = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyItem = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1600);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <section className="recommended-improvements">
      {/* =========================================
          Header
      ========================================= */}
      <div className="improvements-header">
        <div className="improvements-header-left">
          <div className="improvements-header-icon">
            <Wrench className="improvements-header-icon-svg" />
          </div>
          <div>
            <h2>Recommended Improvements</h2>
            <p>
              Practical, prioritized changes to strengthen your resume and
              boost your ATS performance.
            </p>
          </div>
        </div>

        {improvements.length > 0 && (
          <div className="improvements-progress">
            <div className="improvements-progress-meta">
              <span className="improvements-progress-label">
                Progress
              </span>
              <span className="improvements-progress-value">
                {completedCount}/{improvements.length}
              </span>
            </div>

            <div className="improvements-progress-track">
              <div
                className="improvements-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          Empty state
      ========================================= */}
      {improvements.length === 0 ? (
        <div className="improvements-empty">
          <div className="improvements-empty-icon-wrap">
            <CheckCircle2 className="improvements-empty-icon" />
          </div>
          <h3>No improvements recommended</h3>
          <p>
            Your resume is already in great shape — no further action items
            were identified by the AI.
          </p>
        </div>
      ) : (
        <>
          {/* =========================================
              Filter bar
          ========================================= */}
          <div className="improvements-filters" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={filter === "all"}
              className={`improvements-filter${
                filter === "all" ? " active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              <Zap className="improvements-filter-icon" />
              <span>All</span>
              <span className="improvements-filter-count">
                {improvements.length}
              </span>
            </button>

            {CATEGORY_RULES.filter((cat) =>
              categoryCounts.has(cat.id)
            ).map((cat) => {
              const Icon = cat.Icon;
              const count = categoryCounts.get(cat.id) || 0;
              const isActive = filter === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`improvements-filter${
                    isActive ? " active" : ""
                  }`}
                  onClick={() => setFilter(cat.id)}
                >
                  <Icon className="improvements-filter-icon" />
                  <span>{cat.label}</span>
                  <span className="improvements-filter-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* =========================================
              Improvements list
          ========================================= */}
          <div className="improvements-list">
            {visible.length === 0 ? (
              <div className="improvements-filter-empty">
                <Target className="improvements-filter-empty-icon" />
                <p>No improvements in this category.</p>
              </div>
            ) : (
              visible.map((item, idx) => {
                const { id, text, category, priority } = item;
                const Icon = category.Icon;
                const isDone = completed.has(id);
                const isCopied = copiedIndex === id;

                return (
                  <article
                    key={id}
                    className={`improvement-item priority-${priority}${
                      isDone ? " is-done" : ""
                    }`}
                    style={{ "--delay": `${idx * 60}ms` }}
                  >
                    {/* Left: check button */}
                    <button
                      type="button"
                      className="improvement-check"
                      onClick={() => toggleComplete(id)}
                      aria-pressed={isDone}
                      aria-label={
                        isDone
                          ? "Mark as not completed"
                          : "Mark as completed"
                      }
                    >
                      {isDone ? (
                        <Check className="improvement-check-icon" />
                      ) : (
                        <span className="improvement-check-dot" />
                      )}
                    </button>

                    {/* Number badge */}
                    <div className="improvement-number">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    {/* Body */}
                    <div className="improvement-body">
                      <div className="improvement-meta">
                        <span className="improvement-tag improvement-tag-category">
                          <Icon className="improvement-tag-icon" />
                          {category.label}
                        </span>
                        <span
                          className={`improvement-tag improvement-tag-priority priority-${priority}`}
                        >
                          <Lightbulb className="improvement-tag-icon" />
                          {priority} priority
                        </span>
                      </div>

                      <p className="improvement-text">{text}</p>
                    </div>

                    {/* Right actions */}
                    <div className="improvement-actions">
                      <button
                        type="button"
                        className="improvement-action"
                        onClick={() => copyItem(text, id)}
                        aria-label="Copy improvement"
                        title="Copy"
                      >
                        {isCopied ? (
                          <Check className="improvement-action-icon" />
                        ) : (
                          <Copy className="improvement-action-icon" />
                        )}
                      </button>

                      <ChevronRight className="improvement-arrow" />
                    </div>

                    {/* Priority accent bar */}
                    <span
                      className={`improvement-accent priority-${priority}`}
                      aria-hidden="true"
                    />
                  </article>
                );
              })
            )}
          </div>

          {/* =========================================
              Footer tip
          ========================================= */}
          {completedCount > 0 && (
            <div className="improvements-footer">
              <Star className="improvements-footer-icon" />
              <span>
                {progress === 100
                  ? "All recommendations completed — great work!"
                  : `You've completed ${completedCount} of ${improvements.length} recommendations.`}
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default RecommendedImprovements;