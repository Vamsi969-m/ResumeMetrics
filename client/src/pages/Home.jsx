import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  Briefcase,
  Rocket,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  Play,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import "./Home.css";

/* ---------------------------------------------
   Data
--------------------------------------------- */
const FEATURES = [
  {
    Icon: BarChart3,
    title: "ATS Score",
    description:
      "See exactly how applicant tracking systems read your resume and optimize for the algorithms recruiters use.",
    tone: "indigo",
  },
  {
    Icon: Bot,
    title: "AI Analysis",
    description:
      "Deep content feedback on strengths, weaknesses, tone, and impact — powered by advanced language models.",
    tone: "violet",
  },
  {
    Icon: Briefcase,
    title: "Job Recommendations",
    description:
      "Discover roles that genuinely fit your skills and experience — ranked by real compatibility.",
    tone: "cyan",
  },
  {
    Icon: Rocket,
    title: "Skill Roadmap",
    description:
      "A personalized learning path that closes the gap between where you are and where you want to be.",
    tone: "emerald",
  },
];

const METRICS = [
  { value: "92%", label: "ATS pass rate" },
  { value: "3.4×", label: "More interviews" },
  { value: "60s", label: "Full analysis" },
];

/* ---------------------------------------------
   Component
--------------------------------------------- */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <main>
        {/* =========================================
            HERO — split layout
        ========================================= */}
        <section className="home-hero">
          <div className="home-hero-glow" aria-hidden="true">
            <span className="glow glow-indigo" />
            <span className="glow glow-violet" />
            <span className="glow glow-cyan" />
          </div>

          <div className="home-hero-inner">
            {/* ---------- Left: copy ---------- */}
            <div className="home-hero-copy">
              <span className="home-badge">
                <Sparkles className="home-badge-icon" />
                AI-Powered Resume Intelligence
              </span>

              <h1 className="home-title">
                Analyze Your Resume.
                <span className="home-title-accent">
                  Improve Your Career.
                </span>
              </h1>

              <p className="home-subtitle">
                Upload your resume and get an instant AI analysis — ATS score,
                skill gaps, job recommendations, and a personalized career
                roadmap.
              </p>

              <div className="home-cta-row">
                <button
                  type="button"
                  className="home-btn home-btn--primary"
                  onClick={() => navigate("/analyzer")}
                >
                  Analyze My Resume
                  <ArrowRight className="home-btn-icon" />
                </button>

                <button
                  type="button"
                  className="home-btn home-btn--ghost"
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard className="home-btn-icon" />
                  View Dashboard
                </button>
              </div>

              <ul className="home-trust">
                <li>
                  <CheckCircle2 className="home-trust-icon" />
                  ATS Optimized
                </li>
                <li>
                  <CheckCircle2 className="home-trust-icon" />
                  Real-time feedback
                </li>
                <li>
                  <CheckCircle2 className="home-trust-icon" />
                  Job matching
                </li>
              </ul>
            </div>

            {/* ---------- Right: preview mock ---------- */}
            <div className="home-hero-preview">
              <div className="preview-card">
                {/* Preview window chrome */}
                <div className="preview-chrome">
                  <div className="preview-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-amber" />
                    <span className="dot dot-green" />
                  </div>
                  <div className="preview-url">resumeai.app/analysis</div>
                </div>

                {/* Preview body */}
                <div className="preview-body">
                  <div className="preview-top">
                    <div className="preview-score-block">
                      <span className="preview-score-label">
                        Overall Score
                      </span>
                      <div className="preview-score-row">
                        <span className="preview-score-value">87</span>
                        <span className="preview-score-max">/100</span>
                      </div>
                    </div>

                    <div className="preview-score-ring">
                      <svg viewBox="0 0 80 80">
                        <defs>
                          <linearGradient
                            id="homePreviewGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        <circle
                          className="preview-ring-track"
                          cx="40"
                          cy="40"
                          r="30"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          className="preview-ring-progress"
                          cx="40"
                          cy="40"
                          r="30"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 30}
                          strokeDashoffset={
                            2 * Math.PI * 30 - (87 / 100) * 2 * Math.PI * 30
                          }
                          transform="rotate(-90 40 40)"
                        />
                      </svg>
                      <TrendingUp className="preview-ring-icon" />
                    </div>
                  </div>

                  {/* Mini bar rows */}
                  <div className="preview-rows">
                    <div className="preview-row">
                      <div className="preview-row-head">
                        <span>ATS Compatibility</span>
                        <span>94%</span>
                      </div>
                      <div className="preview-bar">
                        <span
                          className="preview-bar-fill preview-bar-indigo"
                          style={{ width: "94%" }}
                        />
                      </div>
                    </div>

                    <div className="preview-row">
                      <div className="preview-row-head">
                        <span>Content Quality</span>
                        <span>82%</span>
                      </div>
                      <div className="preview-bar">
                        <span
                          className="preview-bar-fill preview-bar-violet"
                          style={{ width: "82%" }}
                        />
                      </div>
                    </div>

                    <div className="preview-row">
                      <div className="preview-row-head">
                        <span>Keyword Match</span>
                        <span>89%</span>
                      </div>
                      <div className="preview-bar">
                        <span
                          className="preview-bar-fill preview-bar-cyan"
                          style={{ width: "89%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live insight pill */}
                  <div className="preview-insight">
                    <Bot className="preview-insight-icon" />
                    <span>3 improvement suggestions found</span>
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <div className="floating-chip floating-chip--a">
                <Target className="floating-chip-icon" />
                <span>ATS Ready</span>
              </div>

              <div className="floating-chip floating-chip--b">
                <Zap className="floating-chip-icon" />
                <span>+42% impact</span>
              </div>
            </div>
          </div>

          {/* ---------- Metrics strip ---------- */}
          <div className="home-metrics">
            {METRICS.map((m) => (
              <div className="home-metric" key={m.label}>
                <span className="home-metric-value">{m.value}</span>
                <span className="home-metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            FEATURES
        ========================================= */}
        <section className="home-features">
          <div className="home-features-inner">
            <header className="home-features-header">
              <span className="home-section-eyebrow">
                <span className="home-section-dot" />
                Platform
              </span>
              <h2 className="home-features-title">
                Everything you need to{" "}
                <span className="home-features-title-accent">
                  get hired
                </span>
              </h2>
              <p className="home-features-subtitle">
                Four core modules that turn your resume into a job-winning
                document.
              </p>
            </header>

            <div className="home-features-grid">
              {FEATURES.map(({ Icon, title, description, tone }, i) => (
                <article
                  key={title}
                  className={`feature-card tone-${tone}`}
                  style={{ "--delay": `${i * 70}ms` }}
                >
                  <div className="feature-card-top">
                    <span className="feature-icon-wrap">
                      <Icon className="feature-icon" />
                    </span>
                    <span className="feature-number">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-description">{description}</p>

                  <div className="feature-cta">
                    <span>Explore</span>
                    <ArrowRight className="feature-cta-icon" />
                  </div>

                  <span className="feature-accent" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          FOOTER
      ========================================= */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <span className="home-footer-mark">R</span>
            <div>
              <span className="home-footer-title">
                Resume<span className="home-footer-accent">AI</span>
              </span>
              <span className="home-footer-tagline">
                Built for job seekers who take their career seriously.
              </span>
            </div>
          </div>

          <div className="home-footer-copy">
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;