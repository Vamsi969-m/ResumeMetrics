import { useMemo, useState } from "react";
import {
  Rocket,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Code2,
  Database,
  Cloud,
  Palette,
  Shield,
  Brain,
  BookOpen,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Flame,
  Layers,
  BarChart3,
} from "lucide-react";
import "./LearningRecommendations.css";

/* ---------------------------------------------
   Priority config
--------------------------------------------- */
const PRIORITY_CONFIG = {
  high: {
    id: "high",
    label: "High",
    Icon: Flame,
    order: 3,
  },
  medium: {
    id: "medium",
    label: "Medium",
    Icon: Zap,
    order: 2,
  },
  low: {
    id: "low",
    label: "Low",
    Icon: BookOpen,
    order: 1,
  },
};

/* ---------------------------------------------
   Skill category detection (keyword heuristic)
--------------------------------------------- */
const CATEGORY_RULES = [
  {
    id: "frontend",
    label: "Frontend",
    Icon: Code2,
    keywords: [
      "react",
      "vue",
      "angular",
      "svelte",
      "next",
      "css",
      "html",
      "tailwind",
      "frontend",
      "ui",
      "javascript",
      "typescript",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    Icon: Layers,
    keywords: [
      "node",
      "express",
      "django",
      "flask",
      "spring",
      "rails",
      "java",
      "python",
      "go",
      "rust",
      "api",
      "backend",
      "server",
    ],
  },
  {
    id: "database",
    label: "Data",
    Icon: Database,
    keywords: [
      "sql",
      "mongo",
      "postgres",
      "mysql",
      "redis",
      "database",
      "data",
      "analytics",
      "etl",
      "warehouse",
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    Icon: Cloud,
    keywords: [
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "terraform",
      "ci/cd",
      "devops",
      "cloud",
      "jenkins",
    ],
  },
  {
    id: "design",
    label: "Design",
    Icon: Palette,
    keywords: [
      "figma",
      "sketch",
      "adobe",
      "ux",
      "ui",
      "design",
      "prototyp",
      "wireframe",
    ],
  },
  {
    id: "security",
    label: "Security",
    Icon: Shield,
    keywords: [
      "security",
      "auth",
      "encryption",
      "penetration",
      "vulnerability",
      "cyber",
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    Icon: Brain,
    keywords: [
      "machine learning",
      "ml",
      "ai",
      "tensorflow",
      "pytorch",
      "nlp",
      "deep learning",
      "neural",
    ],
  },
];

const detectCategory = (text) => {
  const lower = (text || "").toLowerCase();
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

  return (
    best || {
      id: "general",
      label: "General",
      Icon: Sparkles,
      keywords: [],
    }
  );
};

const normalizePriority = (value) => {
  const p = String(value || "medium").toLowerCase();
  return PRIORITY_CONFIG[p] ? p : "medium";
};

const EMPTY_RECOMMENDATIONS = [];

/* ---------------------------------------------
   Component
--------------------------------------------- */
function LearningRecommendations({ analysis }) {
  const recommendations = Array.isArray(analysis?.learningRecommendations)
    ? analysis.learningRecommendations
    : EMPTY_RECOMMENDATIONS;

  const [filter, setFilter] = useState("all");

  /* Enrich each recommendation with category + priority meta */
  const enriched = useMemo(() => {
    return recommendations.map((item, index) => {
      const skill = item.skill || "Unnamed Skill";
      const reason = item.reason || "";
      const priority = normalizePriority(item.priority);
      const category = detectCategory(`${skill} ${reason}`);

      return {
        id: index,
        skill,
        reason,
        priority,
        priorityMeta: PRIORITY_CONFIG[priority],
        category,
      };
    });
  }, [recommendations]);

  /* Stats */
  const stats = useMemo(() => {
    const total = enriched.length;
    const high = enriched.filter((i) => i.priority === "high").length;
    const medium = enriched.filter((i) => i.priority === "medium").length;
    const low = enriched.filter((i) => i.priority === "low").length;

    const categoryCount = new Set(enriched.map((i) => i.category.id)).size;

    return { total, high, medium, low, categoryCount };
  }, [enriched]);

  /* Sort by priority (high → low), then original order */
  const sorted = useMemo(() => {
    const list = [...enriched];
    list.sort((a, b) => b.priorityMeta.order - a.priorityMeta.order);
    return list;
  }, [enriched]);

  const visible =
    filter === "all"
      ? sorted
      : sorted.filter((i) => i.priority === filter);

  return (
    <section className="learning-recommendations">
      {/* =========================================
          Header
      ========================================= */}
      <div className="learning-header-main">
        <div className="learning-header-left">
          <div className="learning-header-icon">
            <Rocket className="learning-header-icon-svg" />
          </div>
          <div>
            <h2>Learning Recommendations</h2>
            <p>
              Skill-building priorities curated from your resume gaps and
              target roles.
            </p>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="learning-header-stats">
            <div className="learning-stat">
              <Target className="learning-stat-icon stat-indigo" />
              <div>
                <span className="learning-stat-value">{stats.total}</span>
                <span className="learning-stat-label">
                  {stats.total === 1 ? "Skill" : "Skills"}
                </span>
              </div>
            </div>
            <div className="learning-stat-divider" />
            <div className="learning-stat">
              <Flame className="learning-stat-icon stat-red" />
              <div>
                <span className="learning-stat-value">{stats.high}</span>
                <span className="learning-stat-label">High priority</span>
              </div>
            </div>
            <div className="learning-stat-divider" />
            <div className="learning-stat">
              <BarChart3 className="learning-stat-icon stat-cyan" />
              <div>
                <span className="learning-stat-value">
                  {stats.categoryCount}
                </span>
                <span className="learning-stat-label">
                  {stats.categoryCount === 1 ? "Category" : "Categories"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          Empty state
      ========================================= */}
      {recommendations.length === 0 ? (
        <div className="learning-empty">
          <div className="learning-empty-icon-wrap">
            <CheckCircle2 className="learning-empty-icon" />
          </div>
          <h3>No learning recommendations</h3>
          <p>
            Your current skill set already covers the needs of your target
            roles. Keep building real-world projects to reinforce them.
          </p>
        </div>
      ) : (
        <>
          {/* =========================================
              Priority filter
          ========================================= */}
          <div
            className="learning-filters"
            role="tablist"
            aria-label="Filter by priority"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filter === "all"}
              className={`learning-filter${
                filter === "all" ? " active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              <Sparkles className="learning-filter-icon" />
              <span>All</span>
              <span className="learning-filter-count">{stats.total}</span>
            </button>

            {["high", "medium", "low"].map((key) => {
              const meta = PRIORITY_CONFIG[key];
              const Icon = meta.Icon;
              const count =
                key === "high"
                  ? stats.high
                  : key === "medium"
                  ? stats.medium
                  : stats.low;

              if (count === 0) return null;

              const isActive = filter === key;

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`learning-filter priority-${key}${
                    isActive ? " active" : ""
                  }`}
                  onClick={() => setFilter(key)}
                >
                  <Icon className="learning-filter-icon" />
                  <span>{meta.label}</span>
                  <span className="learning-filter-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* =========================================
              Recommendations grid
          ========================================= */}
          {visible.length === 0 ? (
            <div className="learning-filter-empty">
              <Target className="learning-filter-empty-icon" />
              <p>No recommendations in this priority tier.</p>
            </div>
          ) : (
            <div className="learning-grid">
              {visible.map((item, index) => {
                const {
                  id,
                  skill,
                  reason,
                  priority,
                  priorityMeta,
                  category,
                } = item;
                const PriorityIcon = priorityMeta.Icon;
                const CategoryIcon = category.Icon;

                return (
                  <article
                    key={id}
                    className={`learning-card priority-${priority}`}
                    style={{ "--delay": `${index * 60}ms` }}
                  >
                    {/* Header row */}
                    <div className="learning-card-top">
                      <span className="learning-category-tag">
                        <CategoryIcon className="learning-category-icon" />
                        {category.label}
                      </span>

                      <span
                        className={`learning-priority-tag priority-${priority}`}
                      >
                        <PriorityIcon className="learning-priority-icon" />
                        {priorityMeta.label}
                      </span>
                    </div>

                    {/* Skill */}
                    <div className="learning-skill-block">
                      <h3 className="learning-skill">{skill}</h3>
                      <ArrowUpRight className="learning-skill-arrow" />
                    </div>

                    {/* Reason */}
                    {reason && (
                      <p className="learning-reason">{reason}</p>
                    )}

                    {/* Footer meta */}
                    <div className="learning-card-footer">
                      <span className="learning-meta-chip">
                        <Clock className="learning-meta-icon" />
                        {priority === "high"
                          ? "Start now"
                          : priority === "medium"
                          ? "Next quarter"
                          : "When ready"}
                      </span>
                      <span className="learning-meta-chip">
                        <TrendingUp className="learning-meta-icon" />
                        {priority === "high"
                          ? "Critical"
                          : priority === "medium"
                          ? "Valuable"
                          : "Bonus"}
                      </span>
                    </div>

                    {/* Priority accent bar */}
                    <span
                      className={`learning-accent priority-${priority}`}
                      aria-hidden="true"
                    />
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default LearningRecommendations;