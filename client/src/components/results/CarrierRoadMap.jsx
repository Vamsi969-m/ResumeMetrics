import { useEffect, useRef, useState } from "react";
import {
  Map,
  Flag,
  CheckCircle2,
  Sparkles,
  Layers,
  Target,
} from "lucide-react";
import "./CarrierRoadmap.css";

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
const getStageTone = (index, total) => {
  if (total <= 1) return "start";
  const ratio = index / (total - 1);
  if (ratio === 0) return "start";
  if (ratio === 1) return "end";
  if (ratio < 0.5) return "early";
  return "advanced";
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
function CareerRoadmap({ analysis }) {
  const roadmap = Array.isArray(analysis?.careerRoadmap)
    ? analysis.careerRoadmap
    : [];

  const total = roadmap.length;
  const totalSkills = roadmap.reduce(
    (sum, s) => sum + (Array.isArray(s.skills) ? s.skills.length : 0),
    0
  );

  /* Reveal-on-scroll for each stage */
  const [visible, setVisible] = useState(() => roadmap.map(() => false));
  const itemRefs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setVisible(roadmap.map(() => true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setVisible((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [roadmap]);

  return (
    <section className="career-roadmap">
      {/* =========================================
          Header
      ========================================= */}
      <div className="roadmap-header">
        <div className="roadmap-header-left">
          <div className="roadmap-header-icon">
            <Map className="roadmap-header-icon-svg" />
          </div>
          <div>
            <h2>Career Roadmap</h2>
            <p>
              A step-by-step growth plan tailored to your resume and career
              direction.
            </p>
          </div>
        </div>

        <div className="roadmap-header-stats">
          <div className="roadmap-stat">
            <Layers className="roadmap-stat-icon" />
            <div>
              <span className="roadmap-stat-value">{total}</span>
              <span className="roadmap-stat-label">
                {total === 1 ? "Stage" : "Stages"}
              </span>
            </div>
          </div>

          <div className="roadmap-stat-divider" />

          <div className="roadmap-stat">
            <Sparkles className="roadmap-stat-icon" />
            <div>
              <span className="roadmap-stat-value">{totalSkills}</span>
              <span className="roadmap-stat-label">
                {totalSkills === 1 ? "Skill" : "Skills"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          Empty state
      ========================================= */}
      {total === 0 ? (
        <div className="roadmap-empty">
          <div className="roadmap-empty-icon-wrap">
            <Target className="roadmap-empty-icon" />
          </div>
          <h3>No roadmap available</h3>
          <p>
            We couldn't generate a career roadmap from this resume. Try
            analyzing an updated version for personalized guidance.
          </p>
        </div>
      ) : (
        /* =========================================
           Timeline
        ========================================= */
        <div className="roadmap-timeline">
          {/* Vertical connector */}
          <div className="roadmap-rail" aria-hidden="true">
            <div className="roadmap-rail-line" />
          </div>

          <ol className="roadmap-list">
            {roadmap.map((stage, index) => {
              const tone = getStageTone(index, total);
              const isVisible = visible[index];
              const skills = Array.isArray(stage.skills)
                ? stage.skills
                : [];
              const isLast = index === total - 1;

              return (
                <li
                  key={`${stage.stage || "stage"}-${index}`}
                  className={`roadmap-item tone-${tone}${
                    isVisible ? " is-visible" : ""
                  }`}
                  data-index={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  style={{ "--delay": `${index * 90}ms` }}
                >
                  {/* Node marker */}
                  <div className="roadmap-node">
                    <div className="roadmap-node-inner">
                      <span className="roadmap-node-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="roadmap-node-pulse" aria-hidden="true" />
                  </div>

                  {/* Card */}
                  <div className="roadmap-card">
                    <div className="roadmap-card-top">
                      <div className="roadmap-card-badge">
                        <Flag className="roadmap-card-badge-icon" />
                        <span>
                          {isLast ? "Final Stage" : `Stage ${index + 1}`}
                        </span>
                      </div>

                      {isLast && (
                        <span className="roadmap-card-complete">
                          <CheckCircle2 className="roadmap-card-complete-icon" />
                          Goal
                        </span>
                      )}
                    </div>

                    <h3 className="roadmap-card-title">
                      {stage.stage || "Untitled Stage"}
                    </h3>

                    {stage.goal && (
                      <p className="roadmap-card-goal">{stage.goal}</p>
                    )}

                    {skills.length > 0 && (
                      <div className="roadmap-card-skills">
                        <span className="roadmap-card-skills-label">
                          Focus Areas
                        </span>
                        <div className="roadmap-skill-chips">
                          {skills.map((skill, skillIndex) => (
                            <span
                              key={`${skill}-${skillIndex}`}
                              className="roadmap-skill-chip"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}

export default CareerRoadmap;