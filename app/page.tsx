"use client";
import { useState } from "react";

interface ChecklistItem {
  label: string;
  met: boolean;
  note: string;
}

interface ObjectionItem {
  question: string;
  rating: "Solid" | "Room for Improvement";
  reason: string;
}

interface CategoryBase {
  points: number;
  status: string;
}

interface ChecklistCategory extends CategoryBase {
  checklist_score: string;
  items: ChecklistItem[];
}

interface BudgetCategory extends CategoryBase {
  summary: string;
  budget_captured: string | null;
}

interface ObjectionsCategory extends CategoryBase {
  summary: string;
  items: ObjectionItem[];
}

interface CTACategory extends CategoryBase {
  summary: string;
}

interface ScorecardResult {
  rep_name: string;
  client_name: string;
  company_context: string;
  roles_discussed: string[];
  sql: "Yes" | "No";
  sql_criteria: {
    fulltime_need: boolean;
    role_in_mind: boolean;
    hiring_within_30_days: boolean;
    budget_acknowledged: boolean;
    remote_hire: boolean;
  };
  disqualification_reasons: string[];
  overall_score: number;
  max_score: number;
  categories: {
    rapport: ChecklistCategory;
    pitch: ChecklistCategory;
    budget: BudgetCategory;
    objections: ObjectionsCategory;
    cta: CTACategory;
  };
  went_well: string[];
  needs_improvement: string[];
}

function statusColors(status: string) {
  if (status === "Met") return { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" };
  if (status === "Partial") return { bg: "#fffbeb", text: "#92400e", border: "#fde68a" };
  if (status === "N/A") return { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };
  return { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" };
}

function scoreColor(score: number, max: number) {
  const pct = score / max;
  if (pct >= 0.8) return { bg: "#f0fdf4", text: "#166534" };
  if (pct >= 0.5) return { bg: "#fffbeb", text: "#92400e" };
  return { bg: "#fef2f2", text: "#991b1b" };
}

function CheckIcon({ met }: { met: boolean }) {
  return met ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function CriteriaCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {met ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
        </svg>
      )}
      <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
    </div>
  );
}

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const sc = result;

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "2rem 1.5rem" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#122d4b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#0f172a" }}>AE Call Scorecard</h1>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Scale Army · AI-powered quality review</p>
            </div>
          </div>
        </div>

        {!result && (
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem" }}>
            <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 8 }}>Paste call transcript</label>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Paste the full call transcript here..."
              style={{ width: "100%", boxSizing: "border-box", minHeight: 220, fontSize: 14, lineHeight: 1.6, border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, background: "#f8fafc", color: "#0f172a", resize: "vertical", outline: "none", fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
              <button
                onClick={analyze}
                disabled={loading || !transcript.trim()}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", fontSize: 14, fontWeight: 500, cursor: loading ? "wait" : "pointer", background: "#122d4b", border: "none", borderRadius: 8, color: "white", opacity: (!transcript.trim() || loading) ? 0.6 : 1 }}
              >
                {loading ? "Analyzing..." : "Generate scorecard →"}
              </button>
              {error && <span style={{ fontSize: 13, color: "#dc2626" }}>{error}</span>}
            </div>
          </div>
        )}

        {sc && (() => {
          const oc = scoreColor(sc.overall_score, sc.max_score);
          const sqlYes = sc.sql === "Yes";

          return (
            <div>
              <div style={{ background: "#122d4b", borderRadius: 12, padding: "18px 22px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 3px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Scale Army · Call scorecard</p>
                    <p style={{ fontSize: 17, fontWeight: 600, color: "white", margin: 0 }}>{sc.rep_name} → {sc.client_name}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "2px 0 10px" }}>{sc.company_context}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {sc.roles_discussed.map(r => (
                        <span key={r} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "0.5px solid rgba(255,255,255,0.2)" }}>{r}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>Overall score</p>
                    <span style={{ fontSize: 24, fontWeight: 600, background: oc.bg, color: oc.text, padding: "3px 14px", borderRadius: 20 }}>{sc.overall_score} / {sc.max_score}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>SQL status</p>
                    <span style={{ fontSize: 19, fontWeight: 600, padding: "4px 18px", borderRadius: 20, background: sqlYes ? "#f0fdf4" : "#fef2f2", color: sqlYes ? "#166534" : "#991b1b", border: `1px solid ${sqlYes ? "#bbf7d0" : "#fecaca"}` }}>
                      SQL = {sc.sql}
                    </span>
                    {!sqlYes && sc.disqualification_reasons.length > 0 && (
                      <div style={{ marginTop: 8, padding: "8px 10px", background: "#fef2f2", borderRadius: 8 }}>
                        <p style={{ fontSize: 12, fontWeight: 500, color: "#991b1b", margin: "0 0 3px" }}>Disqualification reason(s)</p>
                        {sc.disqualification_reasons.map((r, i) => <p key={i} style={{ fontSize: 12, color: "#991b1b", margin: "2px 0" }}>· {r}</p>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <CriteriaCheck met={sc.sql_criteria.fulltime_need} label="Full-time hiring need" />
                    <CriteriaCheck met={sc.sql_criteria.role_in_mind} label="Role clearly in mind" />
                    <CriteriaCheck met={sc.sql_criteria.hiring_within_30_days} label="Hiring within 30 days" />
                    <CriteriaCheck met={sc.sql_criteria.budget_acknowledged} label="Budget acknowledged" />
                    <CriteriaCheck met={sc.sql_criteria.remote_hire} label="Remote hire (offshore)" />
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: "0 0 10px" }}>Category scores</h3>

              {(["rapport", "pitch"] as const).map((key) => {
                const labels: Record<string, string> = { rapport: "Rapport & needs discovery", pitch: "Pitch" };
                const icons: Record<string, string> = { rapport: "👥", pitch: "📊" };
                const cat = sc.categories[key] as ChecklistCategory;
                const c = statusColors(cat.status);
                return (
                  <div key={key} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{icons[key]}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{labels[key]}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 12px", borderRadius: 20, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                          {cat.status === "Partial" ? `Partial — ${cat.checklist_score}` : cat.status === "Met" ? "Met" : `Not Met — ${cat.checklist_score}`}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0" }}>
                          {cat.points} pt{cat.points !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                      {cat.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <CheckIcon met={item.met} />
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{item.label}</span>
                            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0", lineHeight: 1.5 }}>{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>💰</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Budget acknowledgment</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 12px", borderRadius: 20, background: statusColors(sc.categories.budget.status).bg, color: statusColors(sc.categories.budget.status).text, border: `1px solid ${statusColors(sc.categories.budget.status).border}` }}>{sc.categories.budget.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0" }}>{sc.categories.budget.points} pt{sc.categories.budget.points !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 0 24px", lineHeight: 1.5 }}>{sc.categories.budget.summary}</p>
                {sc.categories.budget.budget_captured && (
                  <div style={{ margin: "8px 0 0 24px", padding: "8px 10px", background: "#eff6ff", borderRadius: 8, fontSize: 12, color: "#1e40af" }}>
                    🏷 {sc.categories.budget.budget_captured}
                  </div>
                )}
              </div>

              <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🛡</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Objection handling</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 12px", borderRadius: 20, background: statusColors(sc.categories.objections.status).bg, color: statusColors(sc.categories.objections.status).text, border: `1px solid ${statusColors(sc.categories.objections.status).border}` }}>{sc.categories.objections.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0" }}>{sc.categories.objections.points} pt{sc.categories.objections.points !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 0 24px", lineHeight: 1.5 }}>{sc.categories.objections.summary}</p>
                {sc.categories.objections.items && sc.categories.objections.items.length > 0 && (
                  <div style={{ marginTop: 8, marginLeft: 24, display: "flex", flexDirection: "column", gap: 6 }}>
                    {sc.categories.objections.items.map((ob, i) => {
                      const solid = ob.rating === "Solid";
                      return (
                        <div key={i} style={{ padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: "#0f172a", fontStyle: "italic" }}>"{ob.question}"</span>
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0, background: solid ? "#f0fdf4" : "#fffbeb", color: solid ? "#166534" : "#92400e" }}>{ob.rating}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{ob.reason}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎯</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>CTA & Timing</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 12px", borderRadius: 20, background: statusColors(sc.categories.cta.status).bg, color: statusColors(sc.categories.cta.status).text, border: `1px solid ${statusColors(sc.categories.cta.status).border}` }}>{sc.categories.cta.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0" }}>
                      {sc.categories.cta.status === "N/A" ? "N/A" : `${sc.categories.cta.points} pt${sc.categories.cta.points !== 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 0 24px", lineHeight: 1.5 }}>{sc.categories.cta.summary}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "white", borderLeft: "3px solid #16a34a", borderRadius: "0 12px 12px 0", border: "1px solid #bbf7d0", padding: "14px 16px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#166534", margin: "0 0 10px" }}>✓ What went well</p>
                  {sc.went_well.map((w, i) => (
                    <p key={i} style={{ fontSize: 13, color: "#0f172a", margin: "0 0 7px", paddingLeft: 8, borderLeft: "2px solid #bbf7d0" }}>{w}</p>
                  ))}
                </div>
                <div style={{ background: "white", borderLeft: "3px solid #d97706", borderRadius: "0 12px 12px 0", border: "1px solid #fde68a", padding: "14px 16px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: "0 0 10px" }}>⚠ Needs improvement</p>
                  {sc.needs_improvement.map((n, i) => (
                    <p key={i} style={{ fontSize: 13, color: "#0f172a", margin: "0 0 7px", paddingLeft: 8, borderLeft: "2px solid #fde68a" }}>{n}</p>
                  ))}
                </div>
              </div>

              <div style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>Score a new call</span>
                <button onClick={() => { setResult(null); setTranscript(""); }} style={{ fontSize: 13, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, background: "white", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }}>
                  ↺ New transcript
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </main>
  );
}
