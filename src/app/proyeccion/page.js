"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ChevronLeft, Activity, Target } from "lucide-react";

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
    <div className="relative h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
      <div
        className="absolute top-0 h-full rounded-full opacity-90 transition-all duration-700"
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
    <div className="grid grid-cols-[72px_1fr_80px] gap-4 items-center group">
      <span className="text-xs font-mono tracking-widest text-slate-500 uppercase group-hover:text-slate-300 transition-colors">{label}</span>
      <RangeBar min={min} max={max} globalMin={globalMin} globalMax={globalMax} color={barColor} />
      <span className="text-[10px] sm:text-xs font-mono text-slate-400 text-right whitespace-nowrap">
        {fmtVal(min)} / {fmtVal(max)}
      </span>
    </div>
  );
}

const METRICS = [
  { key: "vix",     label: "VIX",    unit: "",  globalMin: 10, globalMax: 45 },
  { key: "wti",     label: "WTI",    unit: "",  globalMin: 80, globalMax: 160 },
  { key: "sp500",   label: "S&P500", unit: "%", globalMin: -12, globalMax: 8 },
  { key: "nasdaq",  label: "NDX",    unit: "%", globalMin: -15, globalMax: 10 },
  { key: "dxy",     label: "DXY",    unit: "%", globalMin: -3, globalMax: 5 },
  { key: "cobre",   label: "COBRE",  unit: "%", globalMin: -8, globalMax: 7 },
  { key: "bono10y", label: "10Y",    unit: "%", globalMin: -0.5, globalMax: 1 },
];

const SCENARIOS = [
  {
    key: "pos",
    label: "BULL CASE",
    labelShort: "↑ ALCISTA",
    accent: "#10b981", // Emerald 500
    bgDim: "bg-emerald-950/10",
    textAccent: "text-emerald-400",
    glowColor: "0 0 40px rgba(16,185,129,0.07)",
  },
  {
    key: "neu",
    label: "BASE CASE",
    labelShort: "→ NEUTRO",
    accent: "#f59e0b", // Amber 500
    bgDim: "bg-amber-950/10",
    textAccent: "text-amber-400",
    glowColor: "0 0 40px rgba(245,158,11,0.07)",
  },
  {
    key: "neg",
    label: "BEAR CASE",
    labelShort: "↓ CISNE NEGRO",
    accent: "#ef4444", // Red 500
    bgDim: "bg-red-950/10",
    textAccent: "text-red-400",
    glowColor: "0 0 40px rgba(239,68,68,0.09)",
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

  const toggleExpand = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
          ))}
        </div>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Cargando Inteligencia de Mercado</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="bg-red-950/30 border border-red-900 text-red-400 font-mono p-6 rounded-xl max-w-lg text-center">
          <AlertTriangle className="mx-auto mb-4" size={32} />
          <p>{error ?? "Sin datos de proyección disponibles."}</p>
          <Link href="/" className="mt-6 inline-block text-slate-300 hover:text-white underline underline-offset-4">Volver al Radar</Link>
        </div>
      </div>
    );
  }

  const fechaISO = new Date(data.created_at);
  const fechaStr = fechaISO.toLocaleDateString("es-CL", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  const horaStr = fechaISO.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Contenedor extra ancho (1600px) para que respiren las 3 columnas */}
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        
        {/* ── HEADER ── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/60 pb-5">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Link href="/" className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 p-2 rounded-lg transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <Target className="text-blue-500" /> PROYECCIÓN DE ESCENARIOS
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium ml-14">War Gaming · Inteligencia de Mercados</p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0 bg-slate-900 p-3 md:px-5 rounded-lg border border-slate-800 shadow-sm ml-14 md:ml-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2 justify-start md:justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Última actualización
            </p>
            <p className="font-mono text-sm text-slate-300 font-semibold">
              {fechaStr} <span className="text-slate-500 mx-2">|</span> {horaStr}
            </p>
          </div>
        </header>

        {/* ── SCENARIO GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {SCENARIOS.map((sc, idx) => {
            const nombre = data[`${sc.key}_nombre`];
            const narrativa = data[`${sc.key}_narrativa`];
            const gatillante = data[`${sc.key}_gatillante`];
            const isOpen = expanded[sc.key];

            return (
              <div
                key={sc.key}
                className={`flex flex-col p-6 md:p-8 rounded-2xl border border-slate-800/80 shadow-2xl transition-all duration-300 hover:border-slate-700 ${sc.bgDim}`}
                style={{
                  borderTopWidth: '4px',
                  borderTopColor: sc.accent,
                  boxShadow: sc.glowColor,
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm md:text-base font-bold tracking-[0.15em] ${sc.textAccent}`}>
                    {sc.labelShort}
                  </span>
                  <span className="text-xs tracking-widest border px-2.5 py-1 rounded border-current opacity-80" style={{ color: sc.accent }}>
                    {sc.label}
                  </span>
                </div>

                {/* Nombre */}
                <h3 className="text-xl md:text-2xl font-serif font-semibold leading-snug text-slate-100 mb-6">
                  {nombre ?? "—"}
                </h3>

                <div className="h-px w-full bg-slate-800 mb-6" />

                {/* Narrativa */}
                <div className="flex flex-col gap-3 flex-grow mb-8">
                  <h4 className="text-xs tracking-[0.2em] text-slate-500 uppercase font-bold">Análisis</h4>
                  <p className={`text-sm leading-relaxed font-mono text-slate-400 ${isOpen ? '' : 'line-clamp-5'}`}>
                    {stripMarkdown(narrativa)}
                  </p>
                  {narrativa && narrativa.length > 250 && (
                    <button
                      onClick={() => toggleExpand(sc.key)}
                      className="text-xs tracking-widest font-bold uppercase mt-2 text-left transition-opacity hover:opacity-70"
                      style={{ color: sc.accent }}
                    >
                      {isOpen ? "▲ VER MENOS" : "▼ VER COMPLETO"}
                    </button>
                  )}
                </div>

                {/* Gatillante */}
                <div className="p-4 bg-black/20 rounded-xl mb-8 border-l-2" style={{ borderLeftColor: sc.accent }}>
                  <h4 className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold mb-2">Gatillante Principal</h4>
                  <p className="text-sm leading-relaxed text-slate-300 italic">
                    {stripMarkdown(gatillante) ?? "—"}
                  </p>
                </div>

                {/* Rangos proyectados */}
                <div className="flex flex-col gap-4 mt-auto">
                  <h4 className="text-xs tracking-[0.2em] text-slate-500 uppercase font-bold">Rangos Proyectados (Próx. Semana)</h4>
                  <div className="flex flex-col gap-3 bg-slate-950/40 p-5 rounded-xl border border-slate-800/50">
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
        <footer className="pt-8 pb-4 text-center">
          <span className="text-xs tracking-widest text-slate-600 uppercase font-mono">
            GENERADO VÍA IA · SOLO REFERENCIAL · NO CONSTITUYE ASESORÍA FINANCIERA
          </span>
        </footer>
      </div>
    </div>
  );
}