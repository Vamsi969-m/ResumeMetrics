import { useMemo, useState } from "react";
import {
  Briefcase,
  TrendingUp,
  Target,
  Sparkles,
  Building2,
  ArrowUpDown,
  Star,
  Bookmark,
  BookmarkCheck,
  BarChart3,
  Award,
} from "lucide-react";
import "./JobRecommendation.css";

/* ---------------------------------------------
   Tier classification
--------------------------------------------- */
const getMatchTier = (match) => {
  if (match >= 85)
    return {
      id: "excellent",
      label: "Excellent Match",
      short: "Excellent",
    };
  if (match >= 70)
    return { id: "strong", label: "Strong Match", short: "Strong" };
  if (match >= 50)
    return { id: "fair", label: "Fair Match", short: "Fair" };
  return { id: "low", label: "Lower Match", short: "Low" };
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
function JobRecommendations({ analysis }) {
  const jobs = Array.isArray(analysis?.jobRoles) ? analysis.jobRoles : [];

  const [sortDesc, setSortDesc] = useState(true);
  const [saved, setSaved] = useState(() => new Set());

  /* Compute stats + enrich with tier */
  const { enriched, stats } = useMemo(() => {
    const withTier = jobs.map((job, index) => {
      const match = Math.max(0, Math.min(100, Number(job.match) || 0));
      return {
        id: index,
        title: job.title || "Untitled Role",
        reason: job.reason || "",
        match,
        tier: getMatchTier(match),
      };
    });

    const avg =
      withTier.length > 0
        ? Math.round(
            withTier.reduce((sum, j) => sum + j.match, 0) / withTier.length
          )
        : 0;

    const topMatch = withTier.reduce(
      (max, j) => (j.match > max ? j.match : max),
      0
    );

    return {
      enriched: withTier,
      stats: {
        total: withTier.length,
        avg,
        topMatch,
        excellent: withTier.filter((j) => j.tier.id === "excellent").length,
      },
    };
  }, [jobs]);

  const visible = useMemo(() => {
    const list = [...enriched];
    list.sort((a, b) => (sortDesc ? b.match - a.match : a.match - b.match));
    return list;
  }, [enriched, sortDesc]);

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="job-recommendations">
      {/* =========================================
          Header
      ========================================= */}
      <div className="jobs-header">
        <div className="jobs-header-left">
          <div className="jobs-header-icon">
            <Briefcase className="jobs-header-icon-svg" />
          </div>
          <div>
            <h2>Recommended Job Roles</h2>
            <p>
              Roles that best align with your resume, skills, and experience
              profile.
            </p>
          </div>
        </div>

        {jobs.length > 0 && (
          <button
            type="button"
            className="jobs-sort"
            onClick={() => setSortDesc((s) => !s)}
            aria-label="Toggle sort order"
          >
            <ArrowUpDown className="jobs-sort-icon" />
            <span>{sortDesc ? "Match ↓" : "Match ↑"}</span>
          </button>
        )}
      </div>

      {/* =========================================
          Stats strip
      ========================================= */}
      {jobs.length > 0 && (
        <div className="jobs-stats">
          <div className="jobs-stat">
            <div className="jobs-stat-icon-wrap stat-indigo">
              <Target className="jobs-stat-icon" />
            </div>
            <div>
              <span className="jobs-stat-value">{stats.total}</span>
              <span className="jobs-stat-label">
                {stats.total === 1 ? "Role" : "Roles"} matched
              </span>
            </div>
          </div>

          <div className="jobs-stat-divider" />

          <div className="jobs-stat">
            <div className="jobs-stat-icon-wrap stat-cyan">
              <BarChart3 className="jobs-stat-icon" />
            </div>
            <div>
              <span className="jobs-stat-value">{stats.avg}%</span>
              <span className="jobs-stat-label">Average match</span>
            </div>
          </div>

          <div className="jobs-stat-divider" />

          <div className="jobs-stat">
            <div className="jobs-stat-icon-wrap stat-emerald">
              <Award className="jobs-stat-icon" />
            </div>
            <div>
              <span className="jobs-stat-value">{stats.topMatch}%</span>
              <span className="jobs-stat-label">Top match</span>
            </div>
          </div>

          <div className="jobs-stat-divider" />

          <div className="jobs-stat">
            <div className="jobs-stat-icon-wrap stat-violet">
              <Sparkles className="jobs-stat-icon" />
            </div>
            <div>
              <span className="jobs-stat-value">{stats.excellent}</span>
              <span className="jobs-stat-label">Excellent tier</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          Empty state
      ========================================= */}
      {jobs.length === 0 ? (
        <div className="jobs-empty">
          <div className="jobs-empty-icon-wrap">
            <Target className="jobs-empty-icon" />
          </div>
          <h3>No job recommendations yet</h3>
          <p>
            We couldn&apos;t identify strong role matches from this resume.
            Enrich your resume with more specific skills and achievements.
          </p>
        </div>
      ) : (
        /* =========================================
           Jobs grid
        ========================================= */
        <div className="jobs-grid">
          {visible.map((job, index) => {
            const { id, title, reason, match, tier } = job;
            const isSaved = saved.has(id);
            const circumference = 2 * Math.PI * 26; // r = 26
            const offset = circumference - (match / 100) * circumference;

            return (
              <article
                key={id}
                className={`job-card tier-${tier.id}${
                  isSaved ? " is-saved" : ""
                }`}
                style={{ "--delay": `${index * 70}ms` }}
              >
                {/* Save button */}
                <button
                  type="button"
                  className="job-save"
                  onClick={() => toggleSave(id)}
                  aria-label={isSaved ? "Unsave role" : "Save role"}
                  aria-pressed={isSaved}
                >
                  {isSaved ? (
                    <BookmarkCheck className="job-save-icon" />
                  ) : (
                    <Bookmark className="job-save-icon" />
                  )}
                </button>

                {/* Top: rank badge + tier tag */}
                <div className="job-card-top">
                  <span className="job-rank">
                    <span className="job-rank-hash">#</span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className={`job-tier tier-${tier.id}`}>
                    <Star className="job-tier-icon" />
                    {tier.label}
                  </span>
                </div>

                {/* Body: title + reason + match ring */}
                <div className="job-card-body">
                  <div className="job-card-info">
                    <h3 className="job-title">{title}</h3>

                    {reason && (
                      <p className="job-reason">{reason}</p>
                    )}

                    <div className="job-chips">
                      <span className="job-chip">
                        <Building2 className="job-chip-icon" />
                        Full-time
                      </span>
                      <span className="job-chip">
                        <TrendingUp className="job-chip-icon" />
                        Growth path
                      </span>
                    </div>
                  </div>

                  {/* Match ring */}
                  <div className="job-match-block">
                    <div className="job-match-ring">
                      <svg
                        viewBox="0 0 60 60"
                        role="img"
                        aria-label={`${match}% match`}
                      >
                        <defs>
                          <linearGradient
                            id={`matchGrad-${id}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                          <linearGradient
                            id={`matchGradStrong-${id}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#22d3ee" />
                          </linearGradient>
                          <linearGradient
                            id={`matchGradFair-${id}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#fbbf24" />
                          </linearGradient>
                          <linearGradient
                            id={`matchGradLow-${id}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#64748b" />
                            <stop offset="100%" stopColor="#94a3b8" />
                          </linearGradient>
                        </defs>

                        <circle
                          className="job-match-track"
                          cx="30"
                          cy="30"
                          r="26"
                          strokeWidth="5"
                          fill="none"
                        />

                        <circle
                          className={`job-match-progress tier-${tier.id}`}
                          cx="30"
                          cy="30"
                          r="26"
                          strokeWidth="5"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          transform="rotate(-90 30 30)"
                          style={{
                            stroke: `url(#matchGrad${
                              tier.id === "excellent"
                                ? ""
                                : tier.id === "strong"
                                ? "Strong"
                                : tier.id === "fair"
                                ? "Fair"
                                : "Low"
                            }-${id})`,
                          }}
                        />
                      </svg>

                      <div className="job-match-center">
                        <span className="job-match-value">{match}</span>
                        <span className="job-match-percent">%</span>
                      </div>
                    </div>
                    <span className="job-match-label">Match</span>
                  </div>
                </div>

                {/* Bottom accent */}
                <span
                  className={`job-accent tier-${tier.id}`}
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default JobRecommendations;