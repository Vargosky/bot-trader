'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  AlertTriangle, TrendingUp, TrendingDown, Activity,
  Cpu, CheckCircle2, XCircle, ShieldAlert, Calculator, 
  Zap, FileText, History, Mountain, Wand2
} from 'lucide-react';

// Conexión a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- COMPONENTE DE ACCESO (MORIA GATE) ---
function MoriaGate({ children }) {
  const [input, setInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(false);

  const handleMagic = (e) => {
    e.preventDefault();
    if (input.toLowerCase().trim() === 'mellon') {
      setIsAuthorized(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  if (isAuthorized) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          <Mountain size={100} className={`relative transition-all duration-700 ${error ? 'text-red-600 scale-90' : 'text-slate-800'}`} />
        </div>

        <div className="space-y-4">
          <h2 className="text-blue-500 font-serif italic text-xl tracking-widest opacity-80">
            "Ennyn Durin Aran Moria. Pedo mellon a minno."
          </h2>
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-bold">
            Di amigo y entra
          </p>
        </div>

        <form onSubmit={handleMagic} className="relative group max-w-xs mx-auto">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="..."
            className={`w-full bg-transparent border-b border-slate-800 py-2 text-center text-xl outline-none transition-all duration-500 text-slate-400 focus:border-blue-500/50`}
          />
          <button type="submit" className="mt-6 flex items-center gap-2 mx-auto text-slate-700 hover:text-blue-400 transition-colors uppercase text-[10px] tracking-widest font-bold">
            <Wand2 size={12} /> Invocar
          </button>
        </form>

        <p className="pt-20 text-[9px] text-slate-800 uppercase tracking-widest">
          Einsof Digital Archaeology — {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function RadarDashboard() {
  const [ultimoRegistro, setUltimoRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('bitacora_tactica')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(1)
        .single();
      setUltimoRegistro(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="bg-slate-950 min-h-screen text-slate-600 p-10 font-mono text-xs uppercase tracking-widest">Sincronizando con la bóveda...</div>;
  if (!ultimoRegistro) return <div className="text-slate-400 p-10 font-mono">Error de telemetría.</div>;

  const getColorSemaforo = (estado) => {
    switch (estado) {
      case 'VERDE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40';
      case 'AMARILLO': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40';
      case 'ROJO': return 'bg-red-500/10 text-red-400 border-red-500/40';
      case 'CISNE NEGRO': return 'bg-red-950/40 text-red-500 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.15)]';
      default: return 'bg-slate-800 text-slate-300 border-slate-600';
    }
  };

  let bitacoraObj = null;
  try {
    bitacoraObj = typeof ultimoRegistro.bitacora_calculo === 'string'
      ? JSON.parse(ultimoRegistro.bitacora_calculo)
      : ultimoRegistro.bitacora_calculo;
  } catch (e) { /* Fallback */ }

  return (
    <MoriaGate>
      <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

          {/* HEADER TÁCTICO */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/60 pb-5">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <Activity className="text-blue-500" /> TRADERBOT
              </h1>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium">Radar de Riesgo Sistémico de Einsof</p>
            </div>
            <div className="text-left md:text-right mt-4 md:mt-0 bg-slate-900 p-3 md:px-5 rounded-lg border border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Última actualización</p>
              <p className="font-mono text-sm text-emerald-400 font-semibold">
                {new Date(ultimoRegistro.fecha).toLocaleString('es-CL', {
                  timeZone: 'America/Santiago', hour12: false,
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                }).replace(',', ' |')}
              </p>
            </div>
          </header>

          {/* BANNER DE PROTECCIÓN LEGAL (SUAVIZADO) */}
          <div className="bg-slate-900 border-l-4 border-blue-600 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="text-blue-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-tighter text-[10px]">Entorno de Pruebas de Ingeniería - Einsof Labs</p>
                <p className="text-[9px] text-slate-500 leading-tight mt-1">
                  Este dashboard es un prototipo de visualización de datos estadísticos para uso personal y privado. 
                  Los valores no constituyen asesoría de inversión bajo la normativa de la CMF.
                </p>
              </div>
            </div>
          </div>

          {/* ALERTA CRÍTICA DE DOCUMENTACIÓN */}
          <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <div className="flex items-center gap-4 text-left w-full md:w-auto">
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={32} />
              <div>
                <h2 className="text-amber-400 font-bold text-sm md:text-base uppercase tracking-widest">Advertencia Metodológica</h2>
                <p className="text-amber-200/80 text-sm mt-1 font-mono">Lectura obligatoria: No interpretar resultados sin entender el modelo de ponderación.</p>
              </div>
            </div>
            <Link 
              href="/documentacion" 
              className="w-full md:w-auto flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-3 rounded-lg transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              Ver Documentación
            </Link>
          </div>

          {/* SCORE PRINCIPAL */}
          <div className={`w-full p-8 md:p-12 rounded-2xl border ${getColorSemaforo(ultimoRegistro.estado_ia)} flex flex-col items-center text-center transition-all duration-500 relative overflow-hidden`}>
            <div className="absolute top-4 right-4 flex gap-3">
              <div className="bg-black/40 px-3 py-1 rounded-md text-xs font-mono border border-current/20 uppercase">Risk: {ultimoRegistro.risk_score || 'N/A'}</div>
              <div className="bg-black/40 px-3 py-1 rounded-md text-xs font-mono border border-current/20 uppercase">Conf: {ultimoRegistro.confianza || 'N/A'}%</div>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-4 font-bold">Sesgo del Algoritmo (Estado de la Matriz)</p>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase flex items-center gap-4">
              {ultimoRegistro.estado_ia === 'CISNE NEGRO' && <AlertTriangle size={72} strokeWidth={2.5} />}
              {ultimoRegistro.estado_ia}
            </h2>
            <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-8 text-xl md:text-2xl font-mono bg-black/30 px-8 py-4 rounded-xl border border-current/20">
              <p className="uppercase">Preferencia: <span className="font-bold">{ultimoRegistro.orden_ejecucion}</span></p>
              <p className="hidden md:block opacity-40">|</p>
              <p className="uppercase">Observación: <span className="font-bold">{ultimoRegistro.ticker_objetivo}</span></p>
            </div>
          </div>

          {/* JUSTIFICACIÓN ANALÍTICA */}
          <div className="w-full bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-lg">
            <h3 className="text-sm uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2 font-bold leading-none">
              <Cpu size={18} /> Metodología de Resolución
            </h3>

            {bitacoraObj && bitacoraObj.componentes ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Columna Score Base */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-mono">
                      <h4 className="text-slate-300 font-semibold flex items-center gap-2 uppercase text-xs">
                        <Calculator size={16} className="text-slate-400" /> Atributos del Score
                      </h4>
                      <span className="text-white text-xs">Total: {bitacoraObj.score_base_total} pts</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm font-mono">
                        <thead>
                          <tr className="text-slate-600 border-b border-slate-800 text-[10px] uppercase tracking-widest">
                            <th className="pb-2">Componente</th>
                            <th className="pb-2">Valor</th>
                            <th className="pb-2 text-right">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bitacoraObj.componentes.map((c, i) => (
                            <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                              <td className="py-3 text-slate-400 text-xs">{c.nombre}</td>
                              <td className="py-3 text-slate-500 text-xs">{c.valor}</td>
                              <td className={`py-3 text-right font-bold ${c.puntos > 0 ? 'text-rose-500' : c.puntos < 0 ? 'text-emerald-500' : 'text-slate-600'}`}>
                                {c.puntos > 0 ? `+${c.puntos}` : c.puntos}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Columna Correlaciones */}
                  <div className="space-y-4">
                    <h4 className="text-slate-300 font-semibold border-b border-slate-800 pb-2 mb-4 uppercase text-xs font-mono tracking-widest">
                      Validaciones Cruzadas
                    </h4>
                    <div className="space-y-2">
                      {bitacoraObj.correlaciones_cruzadas.map((corr, i) => (
                        <div key={i} className="flex gap-3 text-xs p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                          <div className="mt-0.5">{corr.activa ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-slate-700" />}</div>
                          <div>
                            <p className={`font-bold font-mono text-[10px] mb-1 uppercase ${corr.activa ? 'text-emerald-500' : 'text-slate-600'}`}>{corr.id}</p>
                            <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">{corr.motivo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {bitacoraObj.resolucion && (
                  <div className="w-full flex flex-col items-start space-y-6 border-t border-slate-800 pt-8">
                    <Link href="/proyeccion" className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-3 uppercase tracking-widest text-sm w-full md:w-auto justify-center">
                      <Zap size={24} className="text-yellow-300 group-hover:animate-pulse" />
                      Proyección 5 Días (Análisis de Sentimiento)
                    </Link>

                    <div className={`w-full p-6 md:p-8 rounded-xl border ${bitacoraObj.resolucion.veto_booleano_rojo ? 'bg-red-950/20 border-red-900/40' : 'bg-slate-800/30 border-slate-700/50'}`}>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2 font-bold font-mono">
                        <ShieldAlert size={16} className={bitacoraObj.resolucion.veto_booleano_rojo ? 'text-red-500' : 'text-slate-500'} />
                        Interpretación de Escenario
                      </h4>
                      <div className="space-y-4">
                        <p className="text-lg text-slate-300 leading-relaxed font-medium"><span className="text-slate-600 block text-[9px] uppercase mb-1 font-bold tracking-widest">Motivo de veto / Acción:</span> {bitacoraObj.resolucion.motivo_veto}</p>
                        <div className="h-px w-full bg-slate-700/30" />
                        <p className="text-slate-400 text-sm leading-relaxed italic font-mono"><span className="text-slate-600 block text-[9px] uppercase mb-1 font-not-italic font-bold tracking-widest">Resumen Técnico:</span> {bitacoraObj.resolucion.evaluacion_operativa}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 font-mono bg-slate-900 p-6 rounded-xl border border-slate-800">{ultimoRegistro.bitacora_calculo}</p>
            )}
          </div>

          {/* TELEMETRÍA (WIDGETS) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <Widget title="VIX" valor={ultimoRegistro.vix} delta={ultimoRegistro.vix_delta} inverso={true} />
            <Widget title="Crudo WTI" valor={ultimoRegistro.wti} delta={ultimoRegistro.wti_delta} />
            <Widget title="Oro Físico" valor={ultimoRegistro.oro} delta={ultimoRegistro.oro_delta} />
            <Widget title="Cobre" valor={ultimoRegistro.cobre} delta={ultimoRegistro.cobre_delta} />
            <Widget title="Dólar DXY" valor={ultimoRegistro.dxy} delta={ultimoRegistro.dxy_delta} inverso={true} />
            <Widget title="Bono 10Y" valor={ultimoRegistro.bono10y} delta={ultimoRegistro.bono10y_delta} inverso={true} />
            
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
              <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold mb-2 font-mono">Escudo UF</p>
              <p className="text-2xl font-mono text-white">${ultimoRegistro.uf}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
              <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold mb-2 font-mono">TPM Chile</p>
              <p className="text-2xl font-mono text-white">{ultimoRegistro.tpm}%</p>
            </div>
          </div>

          {/* ACCIÓN SECUNDARIA */}
          <div className="mt-8 pt-4 flex justify-center pb-20">
            <Link href="/analisis" className="group flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 px-8 py-4 rounded-xl text-slate-500 hover:text-blue-400 transition-all shadow-md w-full md:w-auto justify-center">
              <History size={20} className="group-hover:rotate-[-10deg] transition-transform" />
              <span className="font-mono uppercase tracking-[0.2em] font-bold text-xs">Histórico de Escenarios Pasados</span>
            </Link>
          </div>

        </div>
      </div>
    </MoriaGate>
  );
}

function Widget({ title, valor, delta, inverso = false }) {
  const isPositive = delta > 0;
  const isGood = inverso ? !isPositive : isPositive;
  const colorClass = isGood ? 'text-emerald-500' : 'text-red-500';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:bg-slate-800/80 transition-colors group">
      <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold mb-2 font-mono">{title}</p>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-mono text-slate-100 group-hover:text-white transition-colors">{valor}</p>
        <p className={`text-[10px] flex items-center font-mono font-bold ${colorClass} bg-slate-950 px-2 py-1 rounded-md border border-slate-800/50`}>
          <Icon size={12} className="mr-1" /> {Math.abs(delta)}%
        </p>
      </div>
    </div>
  );
}