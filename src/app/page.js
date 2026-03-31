import { createClient } from '@supabase/supabase-js';
import { 
  AlertTriangle, TrendingUp, TrendingDown, Activity, 
  Cpu, CheckCircle2, XCircle, ShieldAlert, Calculator 
} from 'lucide-react';

// Conexión a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const revalidate = 60; 

export default async function RadarDashboard() {
  const { data: ultimoRegistro } = await supabase
    .from('bitacora_tactica')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(1)
    .single();

  if (!ultimoRegistro) return <div className="text-slate-400 p-10 font-mono">Buscando telemetría en la bóveda...</div>;

  const getColorSemaforo = (estado) => {
    switch (estado) {
      case 'VERDE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40';
      case 'AMARILLO': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40';
      case 'ROJO': return 'bg-red-500/10 text-red-400 border-red-500/40';
      case 'CISNE NEGRO': return 'bg-red-950/40 text-red-500 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.15)]';
      default: return 'bg-slate-800 text-slate-300 border-slate-600';
    }
  };

  // 1. INTENTAMOS PARSEAR LA BITÁCORA (Por si Supabase la guardó como String en lugar de JSONB)
  let bitacoraObj = null;
  try {
    bitacoraObj = typeof ultimoRegistro.bitacora_calculo === 'string' 
      ? JSON.parse(ultimoRegistro.bitacora_calculo) 
      : ultimoRegistro.bitacora_calculo;
  } catch (e) {
    // Si falla (ej. datos viejos en texto plano), bitacoraObj queda en null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* HEADER TÁCTICO (Sin cambios, estaba perfecto) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/60 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Activity className="text-blue-500" /> TRADERBOT
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium">Radar de Riesgo Sistémico de Einsoft</p>
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

        {/* ALERTA VISUAL: SEMÁFORO Y ORDEN */}
        <div className={`w-full p-8 md:p-12 rounded-2xl border ${getColorSemaforo(ultimoRegistro.estado_ia)} flex flex-col items-center text-center transition-all duration-500 relative overflow-hidden`}>
          <div className="absolute top-4 right-4 flex gap-3">
             <div className="bg-black/40 px-3 py-1 rounded-md text-xs font-mono border border-current/20">
               SCORE: {ultimoRegistro.risk_score || 'N/A'}
             </div>
             <div className="bg-black/40 px-3 py-1 rounded-md text-xs font-mono border border-current/20">
               CONF: {ultimoRegistro.confianza || 'N/A'}%
             </div>
          </div>

          <p className="text-sm uppercase tracking-[0.2em] opacity-80 mb-4 font-bold">Estado Actual de la Matriz</p>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase flex items-center gap-4">
            {ultimoRegistro.estado_ia === 'CISNE NEGRO' && <AlertTriangle size={72} strokeWidth={2.5} />}
            {ultimoRegistro.estado_ia}
          </h2>
          <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-8 text-xl md:text-2xl font-mono bg-black/30 px-8 py-4 rounded-xl border border-current/20">
            <p>ACCIÓN: <span className="font-bold">{ultimoRegistro.orden_ejecucion}</span></p>
            <p className="hidden md:block opacity-40">|</p>
            <p>OBJETIVO: <span className="font-bold">{ultimoRegistro.ticker_objetivo}</span></p>
          </div>
        </div>

        {/* LA EXPLICACIÓN (AHORA ESTRUCTURADA COMO TABLERO) */}
        <div className="w-full bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-lg">
          <h3 className="text-sm uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2 font-bold">
            <Cpu size={18} /> Justificación Analítica del Motor
          </h3>

          {bitacoraObj && bitacoraObj.componentes ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Tabla de Score Base */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-slate-300 font-semibold flex items-center gap-2">
                    <Calculator size={16} className="text-slate-400"/> Score Base
                  </h4>
                  <span className="bg-slate-800 text-white font-mono px-2 py-1 rounded text-xs">
                    Total: {bitacoraObj.score_base_total} pts
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="pb-2 font-medium">Componente</th>
                        <th className="pb-2 font-medium">Valor</th>
                        <th className="pb-2 font-medium text-right">Puntos</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {bitacoraObj.componentes.map((c, i) => (
                        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="py-3 text-slate-300">{c.nombre}</td>
                          <td className="py-3 text-slate-400">{c.valor}</td>
                          <td className={`py-3 text-right font-bold ${c.puntos > 0 ? 'text-rose-400' : c.puntos < 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {c.puntos > 0 ? `+${c.puntos}` : c.puntos}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Columna Derecha: Correlaciones y Resolución */}
              <div className="space-y-6">
                
                {/* Correlaciones Cruzadas */}
                <div>
                  <h4 className="text-slate-300 font-semibold border-b border-slate-800 pb-2 mb-4">
                    Correlaciones Cruzadas
                  </h4>
                  <div className="space-y-2">
                    {bitacoraObj.correlaciones_cruzadas.map((corr, i) => (
                      <div key={i} className="flex gap-3 text-sm p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                        <div className="flex-shrink-0 mt-0.5">
                          {corr.activa 
                            ? <CheckCircle2 size={16} className="text-emerald-500" />
                            : <XCircle size={16} className="text-slate-600" />
                          }
                        </div>
                        <div>
                          <p className={`font-bold font-mono text-xs mb-1 ${corr.activa ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {corr.id}
                          </p>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2" title={corr.motivo}>
                            {corr.motivo}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Veredicto y Veto */}
                {bitacoraObj.resolucion && (
                  <div className={`p-4 rounded-xl border ${bitacoraObj.resolucion.veto_booleano_rojo ? 'bg-red-950/20 border-red-900/30' : 'bg-slate-800/30 border-slate-700'}`}>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2 font-bold">
                      <ShieldAlert size={14} /> Resolución Operativa
                    </h4>
                    <p className="text-sm text-slate-300 mb-2">
                      <span className="text-slate-500">Motivo de veto:</span> {bitacoraObj.resolucion.motivo_veto}
                    </p>
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-500">Evaluación:</span> {bitacoraObj.resolucion.evaluacion_operativa}
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            // FALLBACK: Si no hay JSON válido, muestra el texto plano antiguo
            <p className="text-lg text-slate-300 leading-relaxed font-mono bg-slate-900 p-6 rounded-xl border border-slate-800">
              {ultimoRegistro.bitacora_calculo}
            </p>
          )}
        </div>

        {/* TABLERO DE TELEMETRÍA (Sin cambios) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <Widget title="Índice VIX" valor={ultimoRegistro.vix} delta={ultimoRegistro.vix_delta} inverso={true} />
          <Widget title="Crudo WTI" valor={ultimoRegistro.wti} delta={ultimoRegistro.wti_delta} />
          <Widget title="Oro Físico" valor={ultimoRegistro.oro} delta={ultimoRegistro.oro_delta} />
          <Widget title="Cobre" valor={ultimoRegistro.cobre} delta={ultimoRegistro.cobre_delta} />
          <Widget title="Dólar DXY" valor={ultimoRegistro.dxy} delta={ultimoRegistro.dxy_delta} inverso={true} />
          <Widget title="Bono 10Y" valor={ultimoRegistro.bono10y} delta={ultimoRegistro.bono10y_delta} inverso={true} />

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:bg-slate-800/80 transition-colors">
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-2">Escudo UF</p>
            <p className="text-2xl font-mono text-white">${ultimoRegistro.uf}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:bg-slate-800/80 transition-colors">
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-2">TPM Chile</p>
            <p className="text-2xl font-mono text-white">{ultimoRegistro.tpm}%</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponente reutilizable (Sin cambios mayores)
function Widget({ title, valor, delta, inverso = false }) {
  const isPositive = delta > 0;
  const isGood = inverso ? !isPositive : isPositive;
  const colorClass = isGood ? 'text-emerald-400' : 'text-red-400';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:bg-slate-800/80 transition-colors group">
      <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-2">{title}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <p className="text-2xl md:text-3xl font-mono text-slate-100 group-hover:text-white transition-colors">
          {valor}
        </p>
        <p className={`text-sm md:text-base flex items-center font-mono font-medium ${colorClass} bg-slate-950 px-2 py-1 rounded-md border border-slate-800`}>
          <Icon size={14} className="mr-1" />
          {Math.abs(delta)}%
        </p>
      </div>
    </div>
  );
}