"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Clock,
  AlertTriangle,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(date) {
  return new Date(date).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-CL", {
    month: "short",
    day: "2-digit",
  });
}

function getHour(date) {
  return new Date(date).getHours();
}

function getDayOfWeek(date) {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return days[new Date(date).getDay()];
}

// ── Subcomponents ──────────────────────────────────────────────────────────

function StatCard({ label, value, unit = "", icon: Icon, color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-950/30 border-blue-900/50 text-blue-400",
    emerald: "bg-emerald-950/30 border-emerald-900/50 text-emerald-400",
    amber: "bg-amber-950/30 border-amber-900/50 text-amber-400",
    red: "bg-red-950/30 border-red-900/50 text-red-400",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
          {label}
        </span>
        {Icon && <Icon size={18} className="opacity-60" />}
      </div>
      <div className="text-2xl md:text-3xl font-bold">
        {value}
        {unit && <span className="text-sm text-slate-400 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function TimeSeriesChart({ data }) {
  const chartData = data.map((d) => ({
    ...d,
    time: formatTime(d.fecha),
    date: formatDate(d.fecha),
  }));

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
        Evolución de Indicadores (Últimas 72h)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradVix" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradWti" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCobre" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#cbd5e1" }}
            formatter={(value) => value?.toFixed(2) ?? "—"}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Area
            type="monotone"
            dataKey="vix"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#gradVix)"
            name="VIX"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="wti"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#gradWti)"
            name="WTI"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="cobre"
            stroke="#ec4899"
            fillOpacity={1}
            fill="url(#gradCobre)"
            name="Cobre"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ConfianzaRiesgoChart({ data }) {
  const chartData = data
    .filter((d) => d.confianza !== null && d.risk_score !== null)
    .map((d) => ({
      confianza: d.confianza,
      risk_score: d.risk_score,
      estado: d.estado_ia || "Sin estado",
      fecha: formatTime(d.fecha),
    }))
    .slice(-50);

  const colors = {
    BUY: "#10b981",
    SELL: "#ef4444",
    HOLD: "#f59e0b",
    "Sin estado": "#64748b",
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
        Relación: Confianza vs Riesgo
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="confianza"
            stroke="#94a3b8"
            name="Confianza (%)"
            type="number"
          />
          <YAxis
            dataKey="risk_score"
            stroke="#94a3b8"
            name="Risk Score"
            type="number"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            formatter={(value) => value?.toFixed(2) ?? "—"}
          />
          <Scatter
            name="Señales"
            data={chartData}
            fill="#3b82f6"
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[entry.estado] || "#64748b"}
                opacity={0.8}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function ActividadPorHora({ data }) {
  const hoursMap = {};
  for (let h = 9; h <= 17; h++) {
    hoursMap[h] = 0;
  }

  data.forEach((d) => {
    if (d.orden_ejecucion) {
      const hour = getHour(d.fecha);
      if (hoursMap[hour] !== undefined) hoursMap[hour]++;
    }
  });

  const chartData = Object.entries(hoursMap).map(([hour, count]) => ({
    hora: `${hour}:00`,
    señales: count,
  }));

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
        Señales por Hora del Día
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis dataKey="hora" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="señales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ActividadPorDia({ data }) {
  const daysMap = {
    Dom: 0,
    Lun: 0,
    Mar: 0,
    Mié: 0,
    Jue: 0,
    Vie: 0,
    Sáb: 0,
  };

  data.forEach((d) => {
    if (d.orden_ejecucion) {
      const day = getDayOfWeek(d.fecha);
      daysMap[day]++;
    }
  });

  const chartData = Object.entries(daysMap).map(([day, count]) => ({
    día: day,
    señales: count,
  }));

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
        Señales por Día de la Semana
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis dataKey="día" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="señales" fill="#f59e0b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TimelineSeñales({ data }) {
  const señales = data
    .filter((d) => d.orden_ejecucion)
    .slice(-20)
    .reverse();

  const estadoColor = {
    BUY: "bg-emerald-900/40 border-emerald-700",
    SELL: "bg-red-900/40 border-red-700",
    HOLD: "bg-amber-900/40 border-amber-700",
  };

  const estadoIcon = {
    BUY: <TrendingUp className="text-emerald-400" size={16} />,
    SELL: <TrendingDown className="text-red-400" size={16} />,
    HOLD: <Activity className="text-amber-400" size={16} />,
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
        Últimas Señales Ejecutadas
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {señales.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay señales registradas</p>
        ) : (
          señales.map((s, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-center justify-between text-sm ${
                estadoColor[s.estado_ia] || "bg-slate-800/40 border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {estadoIcon[s.estado_ia]}
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-semibold truncate">
                    {s.orden_ejecucion || "—"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {s.ticker_objetivo || "Sin ticker"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 whitespace-nowrap">
                  {formatTime(s.fecha)}
                </p>
                <p className="text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(s.fecha)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function BitacoraAnalisisDB() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: rows, error } = await supabase
          .from("bitacora_tactica")
          .select("*")
          .gte("fecha", startDate.toISOString())
          .order("fecha", { ascending: false });

        if (error) throw error;
        setData(rows || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [days]);

  const stats = useMemo(() => {
    const totalSignals = data.filter((d) => d.orden_ejecucion).length;
    const avgConfianza =
      data.filter((d) => d.confianza !== null).reduce((a, b) => a + b.confianza, 0) /
        data.filter((d) => d.confianza !== null).length || 0;
    const avgRisk =
      data.filter((d) => d.risk_score !== null).reduce((a, b) => a + b.risk_score, 0) /
        data.filter((d) => d.risk_score !== null).length || 0;

    const signalsByState = {};
    data.forEach((d) => {
      if (d.estado_ia) {
        signalsByState[d.estado_ia] = (signalsByState[d.estado_ia] || 0) + 1;
      }
    });

    return {
      totalSignals,
      avgConfianza: avgConfianza.toFixed(1),
      avgRisk: avgRisk.toFixed(1),
      signalsByState,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
          Analizando Bitácora de Señales
        </p>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="bg-red-950/30 border border-red-900 text-red-400 font-mono p-6 rounded-xl max-w-lg text-center">
          <AlertTriangle className="mx-auto mb-4" size={32} />
          <p>{error ?? "Sin datos en la bitácora."}</p>
          <Link
            href="/"
            className="mt-6 inline-block text-slate-300 hover:text-white underline underline-offset-4"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/60 pb-5">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Link
                href="/"
                className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 p-2 rounded-lg transition-colors group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <BarChart3 className="text-blue-500" /> ANÁLISIS DE PATRONES
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium ml-14">
              Histórico de Señales · Bot Semáforo
            </p>
          </div>

          <div className="mt-4 md:mt-0 ml-14 md:ml-0">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm cursor-pointer hover:border-slate-600 transition-colors"
            >
              <option value={1}>Últimas 24h</option>
              <option value={7}>Últimos 7 días</option>
              <option value={14}>Últimos 14 días</option>
              <option value={30}>Último mes</option>
            </select>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Señales Ejecutadas"
            value={stats.totalSignals}
            icon={Activity}
            color="blue"
          />
          <StatCard
            label="Confianza Promedio"
            value={stats.avgConfianza}
            unit="%"
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard
            label="Risk Score Promedio"
            value={stats.avgRisk}
            unit="pts"
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            label="Total de Registros"
            value={data.length}
            icon={Calendar}
            color="amber"
          />
        </div>

        {/* Estado Distribution */}
        {Object.keys(stats.signalsByState).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.signalsByState.BUY && (
              <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-emerald-400" size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">
                    Órdenes BUY
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-300">
                  {stats.signalsByState.BUY}
                </p>
              </div>
            )}
            {stats.signalsByState.SELL && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="text-red-400" size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold text-red-400">
                    Órdenes SELL
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-300">
                  {stats.signalsByState.SELL}
                </p>
              </div>
            )}
            {stats.signalsByState.HOLD && (
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-amber-400" size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                    Señales HOLD
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-300">
                  {stats.signalsByState.HOLD}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Charts */}
        <TimeSeriesChart data={data} />
        <ConfianzaRiesgoChart data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <ActividadPorHora data={data} />
          <ActividadPorDia data={data} />
        </div>

        <TimelineSeñales data={data} />

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center">
          <span className="text-xs tracking-widest text-slate-600 uppercase font-mono">
            Análisis de Bitácora · Datos Históricos · {data.length} registros analizados
          </span>
        </footer>
      </div>
    </div>
  );
}