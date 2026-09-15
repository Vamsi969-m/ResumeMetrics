import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Brain,
  Search,
  Wrench,
  Briefcase,
  Rocket,
  Map,
  Download,
  RefreshCw,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import "./Results.css";

import ResumeOverview from "../components/results/ResumeOverview";
import ResumeSummary from "../components/results/ResumeSummary";
import SkillGaps from "../components/results/SkillGaps";
import ResumeMistakes from "../components/results/ResumeMistakes";
import RecommendedImprovements from "../components/results/RecommendedImprovements";
import JobRecommendations from "../components/results/JobRecommendation";
import LearningRecommendations from "../components/results/LearningRecommendations";
import CareerRoadmap from "../components/results/CarrierRoadMap";

/* ---------------------------------------------
   Sidebar navigation config
--------------------------------------------- */
const MENU_ITEMS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard, group: "main" },
  { id: "skillGaps", label: "Skill Gaps", Icon: Brain, group: "analysis" },
  { id: "mistakes", label: "Resume Mistakes", Icon: Search, group: "analysis" },
  { id: "improvements", label: "Improvements", Icon: Wrench, group: "analysis" },
  { id: "jobs", label: "Job Recommendations", Icon: Briefcase, group: "career" },
  { id: "learning", label: "Learning", Icon: Rocket, group: "career" },
  { id: "roadmap", label: "Career Roadmap", Icon: Map, group: "career" },
];

const GROUP_LABELS = {
  main: "Workspace",
  analysis: "Analysis",
  career: "Career Growth",
};

function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  /* Close mobile menu on escape */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Lock body scroll while mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* No analysis guard */
  if (!state?.analysis) {
    return (
      <main className="no-results">
        <div className="no-results-card">
          <div className="no-results-icon-wrap">
            <FileText className="no-results-icon" />
          </div>
          <h2>No analysis found</h2>
          <p>Please analyze a resume first to view your detailed results.</p>
          <button type="button" onClick={() => navigate("/analyzer")}>
            <Sparkles className="btn-icon" />
            Analyze Resume
          </button>
        </div>
      </main>
    );
  }

  const { analysis } = state;

  const renderActiveSection = () => {
    switch (activeSection) {
      case "skillGaps":
        return <SkillGaps analysis={analysis} />;
      case "mistakes":
        return <ResumeMistakes analysis={analysis} />;
      case "improvements":
        return <RecommendedImprovements analysis={analysis} />;
      case "jobs":
        return <JobRecommendations analysis={analysis} />;
      case "learning":
        return <LearningRecommendations analysis={analysis} />;
      case "roadmap":
        return <CareerRoadmap analysis={analysis} />;
      case "overview":
      default:
        return <ResumeSummary analysis={analysis} />;
    }
  };

  const activeIndex = MENU_ITEMS.findIndex((i) => i.id === activeSection);
  const activeItem = MENU_ITEMS[activeIndex] || MENU_ITEMS[0];
  const ActiveIcon = activeItem.Icon;

  const goTo = (dir) => {
    const next = (activeIndex + dir + MENU_ITEMS.length) % MENU_ITEMS.length;
    setActiveSection(MENU_ITEMS[next].id);
  };

  const grouped = MENU_ITEMS.reduce((acc, item) => {
    (acc[item.group] ||= []).push(item);
    return acc;
  }, {});

  return (
    <main className="results-page">
      {/* =========================================
          TOP BAR
      ========================================= */}
      <header className="results-topbar">
        <div className="topbar-left">
          <button
            type="button"
            className="topbar-back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="topbar-back-icon" />
          </button>

          <div className="topbar-brand">
            <div className="topbar-brand-mark">
              <Sparkles className="topbar-brand-icon" />
            </div>
            <div className="topbar-titles">
              <h1>Resume Analytics</h1>
              <p>AI-powered insights to refine your resume and career path.</p>
            </div>
          </div>
        </div>

        <div className="topbar-actions">
          <button type="button" className="ghost-btn">
            <TrendingUp className="btn-icon" />
            <span>Insights</span>
          </button>

          <button type="button" className="download-btn">
            <Download className="btn-icon" />
            <span>Download Report</span>
          </button>
        </div>
      </header>

      {/* =========================================
          MAIN DASHBOARD LAYOUT — full viewport
      ========================================= */}
      <div className={`results-shell${collapsed ? " is-collapsed" : ""}`}>
        {/* ---------- SIDEBAR ---------- */}
        <aside
          className={`results-sidebar${mobileMenuOpen ? " open" : ""}${
            collapsed ? " collapsed" : ""
          }`}
          aria-label="Analysis navigation"
        >
          <div className="sidebar-top">
            <div className="sidebar-workspace">
              <div className="sidebar-workspace-mark">
                <LayoutDashboard className="sidebar-workspace-icon" />
              </div>
              <div className="sidebar-workspace-text">
                <span className="sidebar-workspace-title">Dashboard</span>
                <span className="sidebar-workspace-sub">Analysis Suite</span>
              </div>
            </div>

            <button
              type="button"
              className="sidebar-collapse"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="sidebar-collapse-icon" />
              ) : (
                <PanelLeftClose className="sidebar-collapse-icon" />
              )}
            </button>
          </div>

          <div className="sidebar-body">
            {Object.entries(grouped).map(([groupKey, items]) => (
              <div key={groupKey} className="sidebar-group">
                <div className="sidebar-group-label">
                  <span>{GROUP_LABELS[groupKey]}</span>
                  <span className="sidebar-group-line" />
                </div>

                <nav className="sidebar-nav">
                  {items.map(({ id, label, Icon }) => {
                    const isActive = activeSection === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`sidebar-item${isActive ? " active" : ""}`}
                        onClick={() => {
                          setActiveSection(id);
                          setMobileMenuOpen(false);
                        }}
                        aria-current={isActive ? "page" : undefined}
                        title={collapsed ? label : undefined}
                      >
                        <span className="sidebar-item-active-bar" />
                        <span className="sidebar-icon-wrap">
                          <Icon className="sidebar-icon" />
                        </span>
                        <span className="sidebar-label">{label}</span>
                        {isActive && (
                          <span className="sidebar-item-pulse" aria-hidden />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <button
              type="button"
              className="analyze-again-btn"
              onClick={() => navigate("/analyzer")}
              title={collapsed ? "Analyze Another" : undefined}
            >
              <RefreshCw className="btn-icon" />
              <span>Analyze Another</span>
            </button>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ---------- CONTENT (fills remaining viewport) ---------- */}
        <section className="results-content">
          <div className="content-inner">
            {/* Overview pinned */}
            <div className="content-overview">
              <ResumeOverview analysis={analysis} />
            </div>

            {/* Section header */}
            <div className="content-header">
              <div className="content-header-left">
                <div className="content-breadcrumb">
                  <span>Dashboard</span>
                  <ChevronRight className="breadcrumb-sep" />
                  <span className="breadcrumb-current">
                    {activeItem.label}
                  </span>
                </div>

                <div className="content-title-row">
                  <span className="content-header-icon">
                    <ActiveIcon className="content-header-svg" />
                  </span>
                  <div>
                    <h2>{activeItem.label}</h2>
                    <p>Detailed breakdown and actionable insights</p>
                  </div>
                </div>
              </div>

              <div className="content-header-actions">
                <div className="section-nav">
                  <button
                    type="button"
                    className="section-nav-btn"
                    onClick={() => goTo(-1)}
                    aria-label="Previous section"
                  >
                    <ChevronLeft className="section-nav-icon" />
                  </button>
                  <span className="section-nav-index">
                    {String(activeIndex + 1).padStart(2, "0")}
                    <span className="section-nav-sep">/</span>
                    {String(MENU_ITEMS.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className="section-nav-btn"
                    onClick={() => goTo(1)}
                    aria-label="Next section"
                  >
                    <ChevronRight className="section-nav-icon" />
                  </button>
                </div>

                <button
                  type="button"
                  className="mobile-sidebar-toggle"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label="Toggle analysis navigation"
                  aria-expanded={mobileMenuOpen}
                >
                  <ActiveIcon className="btn-icon" />
                  <span>{activeItem.label}</span>
                </button>
              </div>
            </div>

            {/* Section body — grows to fill */}
            <div className="content-body" key={activeSection}>
              {renderActiveSection()}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Results;