import { createClient } from '@supabase/supabase-js';
import { AlertTriangle, TrendingUp, TrendingDown, Crosshair, Activity, Cpu } from 'lucide-react';

// Conexión a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const revalidate = 60; // Refresca cada 60 segundos

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* HEADER TÁCTICO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/60 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Activity className="text-blue-500" /> Terminal Einsoft
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium">Radar de Riesgo Sistémico</p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0 bg-slate-900 p-3 md:px-5 rounded-lg border border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Última actualización (Valparaíso)</p>
            <p className="font-mono text-sm text-emerald-400 font-semibold">
              {new Date(ultimoRegistro.fecha).toLocaleString('es-CL')}
            </p>
          </div>
        </header>

        {/* ALERTA VISUAL: SEMÁFORO Y ORDEN */}
        <div className={`w-full p-8 md:p-12 rounded-2xl border ${getColorSemaforo(ultimoRegistro.estado_ia)} flex flex-col items-center text-center transition-all duration-500`}>
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

        {/* LA EXPLICACIÓN (DESTACADA) */}
        <div className="w-full bg-blue-950/20 border border-blue-900/50 p-6 md:p-8 rounded-2xl shadow-lg shadow-blue-900/5">
          <p className="text-sm uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2 font-bold">
            <Cpu size={18} /> Justificación del Motor (IA)
          </p>
          <p className="text-lg md:text-xl text-blue-50 leading-relaxed font-mono">
            {ultimoRegistro.bitacora_calculo}
          </p>
        </div>

        {/* TABLERO DE TELEMETRÍA */}
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

// Subcomponente reutilizable
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