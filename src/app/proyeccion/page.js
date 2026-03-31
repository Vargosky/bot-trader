"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n, decimals = 1) {
  if (n === null || n === undefined) return "—";
  const v = parseFloat(n);
  return isNaN(v) ? "—" : v.toFixed(decimals);
}

function fmtRange(min, max, unit = "") {
  if (min === null && max === null) return "—";
  const sign = (v) => (v > 0 ? "+" : "");
  return `${sign(min)}${fmt(min)}${unit} → ${sign(max)}${fmt(max)}${unit}`;
}

function stripMarkdown(text) {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
}

// ── Subcomponents ──────────────────────────────────────────────────────────

function RangeBar({ min, max, globalMin, globalMax, color }) {
  const range = globalMax - globalMin || 1;
  const leftPct = ((min - globalMin) / range) * 100;
  const widthPct = ((max - min) / range) * 100;
  return (
    <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div
        className="absolute top-0 h-full rounded-full opacity-80"
        style={{
          left: `${Math.max(0, leftPct)}%`,
          width: `${Math.min(100 - Math.max(0, leftPct), widthPct)}%`,
          background: color,
        }}
      />
    </div>
  );
}

function MetricRow({ label, min, max, unit = "", globalMin, globalMax, barColor }) {
  const isPercent = unit === "%";
  const fmtVal = (v) => {
    if (v === null || v === undefined) return "—";
    const n = parseFloat(v);
    if (isNaN(n)) return "—";
    const s = isPercent && n > 0 ? "+" : "";
    return `${s}${n.toFixed(isPercent ? 1 : 0)}${unit}`;
  };
  return (
    <div className="grid grid-cols-[72px_1fr_80px] gap-2 items-center">
      <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">{label}</span>
      <RangeBar min={min} max={max} globalMin={globalMin} globalMax={globalMax} color={barColor} />
      <span className="text-[10px] font-mono text-white/50 text-right whitespace-nowrap">
        {fmtVal(min)} / {fmtVal(max)}
      </span>
    </div>
  );
}

const METRICS = [
  { key: "vix",     label: "VIX",    unit: "",   globalMin: 10, globalMax: 45 },
  { key: "wti",     label: "WTI",    unit: "",   globalMin: 80, globalMax: 160 },
  { key: "sp500",   label: "S&P500", unit: "%",  globalMin: -12, globalMax: 8 },
  { key: "nasdaq",  label: "NDX",    unit: "%",  globalMin: -15, globalMax: 10 },
  { key: "dxy",     label: "DXY",    unit: "%",  globalMin: -3, globalMax: 5 },
  { key: "cobre",   label: "COBRE",  unit: "%",  globalMin: -8, globalMax: 7 },
  { key: "bono10y", label: "10Y",    unit: "%",  globalMin: -0.5, globalMax: 1 },
];

const SCENARIOS = [
  {
    key: "pos",
    label: "BULL CASE",
    labelShort: "↑ ALCISTA",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.08)",
    borderTop: "#10b981",
    textAccent: "#34d399",
    glowColor: "0 0 30px rgba(16,185,129,0.12)",
  },
  {
    key: "neu",
    label: "BASE CASE",
    labelShort: "→ NEUTRO",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.08)",
    borderTop: "#f59e0b",
    textAccent: "#fcd34d",
    glowColor: "0 0 30px rgba(245,158,11,0.10)",
  },
  {
    key: "neg",
    label: "BEAR CASE",
    labelShort: "↓ CISNE NEGRO",
    accent: "#ef4444",
    accentDim: "rgba(239,68,68,0.08)",
    borderTop: "#ef4444",
    textAccent: "#f87171",
    glowColor: "0 0 30px rgba(239,68,68,0.12)",
  },
];

// ── Main Component ─────────────────────────────────────────────────────────

export default function PanelEscenariosDB() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data: row, error } = await supabase
          .from("bitacora_escenarios")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (error) throw error;
        setData(row);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleExpand = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return (
      <div style={styles.root}>
        <div style={styles.loading}>
          <div style={styles.loadingDots}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <span style={styles.loadingText}>CARGANDO INTELIGENCIA DE MERCADO</span>
        </div>
        <style>{dotAnim}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={styles.root}>
        <p style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 12 }}>
          {error ?? "Sin datos disponibles."}
        </p>
      </div>
    );
  }

  const fechaISO = new Date(data.created_at);
  const fechaStr = fechaISO.toLocaleDateString("es-CL", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
  const horaStr = fechaISO.toLocaleTimeString("es-CL", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.statusDot} />
          <div>
            <div style={styles.headerTitle}>PROYECCIÓN DE ESCENARIOS</div>
            <div style={styles.headerSub}>War Gaming · Inteligencia de Mercados Internacionales</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.timestamp}>
            <span style={styles.tsLabel}>ÚLTIMA ACTUALIZACIÓN</span>
            <span style={styles.tsValue}>{fechaStr} · {horaStr}</span>
          </div>
        </div>
      </div>

      {/* ── SCENARIO GRID ── */}
      <div style={styles.grid}>
        {SCENARIOS.map((sc, idx) => {
          const nombre    = data[`${sc.key}_nombre`];
          const narrativa = data[`${sc.key}_narrativa`];
          const gatillante = data[`${sc.key}_gatillante`];
          const isOpen = expanded[sc.key];

          return (
            <div
              key={sc.key}
              className="scenario-card"
              style={{
                ...styles.card,
                borderTop: `2px solid ${sc.borderTop}`,
                background: sc.accentDim,
                boxShadow: sc.glowColor,
                animationDelay: `${idx * 0.12}s`,
              }}
            >
              {/* Card header */}
              <div style={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ ...styles.scenarioLabel, color: sc.textAccent }}>
                    {sc.labelShort}
                  </span>
                </div>
                <span style={{ ...styles.scenarioBadge, borderColor: sc.accent, color: sc.accent }}>
                  {sc.label}
                </span>
              </div>

              {/* Nombre */}
              <div style={{ ...styles.cardName, color: "#f1f5f9" }}>
                {nombre ?? "—"}
              </div>

              {/* Divider */}
              <div style={{ ...styles.divider, background: sc.accent + "22" }} />

              {/* Narrativa */}
              <div style={styles.narrativaWrap}>
                <div style={styles.sectionLabel}>ANÁLISIS</div>
                <p
                  className="narrativa-text"
                  style={{
                    ...styles.narrativa,
                    ...(isOpen ? {} : styles.narrativaClamp),
                  }}
                >
                  {stripMarkdown(narrativa)}
                </p>
                {narrativa && narrativa.length > 200 && (
                  <button
                    onClick={() => toggleExpand(sc.key)}
                    style={{ ...styles.expandBtn, color: sc.textAccent }}
                  >
                    {isOpen ? "▲ VER MENOS" : "▼ VER COMPLETO"}
                  </button>
                )}
              </div>

              {/* Gatillante */}
              <div style={{ ...styles.gatillanteBox, borderLeft: `2px solid ${sc.accent}` }}>
                <div style={styles.sectionLabel}>GATILLANTE</div>
                <p style={styles.gatillanteText}>{stripMarkdown(gatillante) ?? "—"}</p>
              </div>

              {/* Rangos proyectados */}
              <div style={styles.rangosWrap}>
                <div style={styles.sectionLabel}>RANGOS PROYECTADOS (PRÓXIMA SEMANA)</div>
                <div style={styles.rangosList}>
                  {METRICS.map((m) => (
                    <MetricRow
                      key={m.key}
                      label={m.label}
                      min={data[`${sc.key}_rango_${m.key}_min`]}
                      max={data[`${sc.key}_rango_${m.key}_max`]}
                      unit={m.unit}
                      globalMin={m.globalMin}
                      globalMax={m.globalMax}
                      barColor={sc.accent}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      <div style={styles.footer}>
        <span style={styles.footerText}>
          GENERADO VÍA IA · SOLO REFERENCIAL · NO CONSTITUYE ASESORÍA FINANCIERA
        </span>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = {
  root: {
    background: "#060a0f",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    padding: "20px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
    boxShadow: "0 0 8px #10b981",
    animation: "pulse 2s infinite",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#e2e8f0",
  },
  headerSub: {
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.3)",
    marginTop: 2,
  },
  headerRight: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    gap: 2,
  },
  timestamp: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  tsLabel: {
    fontSize: 9,
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.2)",
  },
  tsValue: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.04em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 0,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 22px",
    gap: 16,
    borderRight: "1px solid rgba(255,255,255,0.05)",
    animation: "fadeSlideUp 0.5s ease both",
    transition: "box-shadow 0.3s ease",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scenarioLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
  },
  scenarioBadge: {
    fontSize: 9,
    letterSpacing: "0.14em",
    border: "1px solid",
    padding: "2px 8px",
    borderRadius: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "0.02em",
    color: "#f1f5f9",
    fontFamily: "'DM Serif Display', 'Georgia', serif",
  },
  divider: {
    height: 1,
    width: "100%",
  },
  narrativaWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: "0.18em",
    color: "rgba(255,255,255,0.25)",
    marginBottom: 4,
  },
  narrativa: {
    fontSize: 12,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.65)",
    margin: 0,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  narrativaClamp: {
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  expandBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 9,
    letterSpacing: "0.14em",
    padding: 0,
    marginTop: 2,
  },
  gatillanteBox: {
    padding: "10px 14px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 6,
  },
  gatillanteText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.55)",
    margin: 0,
    fontStyle: "italic",
  },
  rangosWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  rangosList: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "60px 40px",
  },
  loadingDots: {
    display: "flex",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#3b82f6",
    animation: "bounce 1s infinite",
    display: "inline-block",
  },
  loadingText: {
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.3)",
  },
  footer: {
    padding: "12px 28px",
    borderTop: "1px solid rgba(255,255,255,0.04)",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 9,
    letterSpacing: "0.14em",
    color: "rgba(255,255,255,0.15)",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=DM+Serif+Display&display=swap');

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }

  .scenario-card:last-child { border-right: none; }
  .scenario-card:hover { background: rgba(255,255,255,0.025) !important; }

  @media (max-width: 900px) {
    .scenario-card {
      border-right: none !important;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
  }
`;

const dotAnim = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }
`;