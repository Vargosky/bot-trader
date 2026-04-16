"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
  AlertCircle,
  Eye,
  Database,
  Network,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function DocumentacionPage() {
  const [expandedSection, setExpandedSection] = useState("flujo");

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const FlowCard = ({ icon: Icon, title, description, children }) => (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-700/50 transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Icon className="text-blue-400" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            {description}
          </p>
          {children && <div className="text-sm text-slate-300">{children}</div>}
        </div>
      </div>
    </div>
  );

  const FeatureItem = ({ label, description }) => (
    <div className="flex gap-3 items-start p-3 bg-slate-950/40 rounded-lg">
      <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={18} />
      <div>
        <p className="font-semibold text-slate-200 text-sm">{label}</p>
        <p className="text-slate-400 text-xs mt-1">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800/60 pb-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
              <Zap size={14} className="text-blue-400" />
              <span className="text-xs font-mono text-blue-300 uppercase tracking-widest">Sistema Integrado</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sistema de Análisis y Predicción de Mercados
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              Plataforma de inteligencia de mercados para inversión en ETF. Analiza contexto, integra noticias y genera predicciones automáticas.
            </p>
          </div>
        </header>

        {/* Flujo General */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Network className="text-blue-400" size={28} />
              Flujo de Datos
            </h2>
            <p className="text-slate-400 text-sm">Cómo funciona el sistema de punta a punta</p>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <FlowCard
              icon={Database}
              title="1. Extracción de Indicadores"
              description="El sistema captura indicadores financieros en tiempo real cada hora durante el horario de mercado"
            >
              <div className="space-y-2">
                <p className="font-semibold text-slate-200 text-sm">Indicadores monitoreados:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
                  <div>• VIX (Volatilidad)</div>
                  <div>• WTI (Petróleo)</div>
                  <div>• Oro</div>
                  <div>• DXY (Dólar)</div>
                  <div>• Cobre</div>
                  <div>• Bonos 10Y</div>
                </div>
                <p className="text-xs text-slate-500 mt-3 p-2 bg-slate-950/40 rounded italic">
                  💡 Estos indicadores definen el contexto general del mercado
                </p>
              </div>
            </FlowCard>

            {/* Arrows */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-1 bg-gradient-to-b from-blue-500 to-transparent"></div>
                <ArrowRight className="text-slate-600" size={20} />
              </div>
            </div>

            {/* Step 2 */}
            <FlowCard
              icon={AlertCircle}
              title="2. Filtrado de Noticias (n8n + IA)"
              description="Se extraen noticias de 5 fuentes financieras. IA determina si son relevantes para el mercado"
            >
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-slate-200 text-sm mb-2">Fuentes de noticias:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Yahoo Finance", "MarketMath", "Investing", "EMOL", "BioBio"].map((source) => (
                      <span key={source} className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 p-2 bg-slate-950/40 rounded italic">
                  ⚙️ n8n automatiza la extracción cada 6 horas. Solo pasan las noticias que IA considera relevantes para movimientos de mercado.
                </p>
              </div>
            </FlowCard>

            {/* Arrows */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-1 bg-gradient-to-b from-blue-500 to-transparent"></div>
                <ArrowRight className="text-slate-600" size={20} />
              </div>
            </div>

            {/* Step 3 */}
            <FlowCard
              icon={Activity}
              title="3. Análisis de Contexto (Semáforo)"
              description="Basado en indicadores actuales, el sistema determina si el contexto es favorable para invertir"
            >
              <div className="space-y-2">
                <p className="font-semibold text-slate-200 text-sm">El Semáforo evalúa:</p>
                <div className="space-y-2">
                  <FeatureItem label="Estado del Mercado" description="Volatilidad, tendencias de precio, fortaleza del dólar" />
                  <FeatureItem label="Risk Score" description="Nivel de riesgo basado en volatilidad histórica y movimientos actuales" />
                  <FeatureItem label="Confianza" description="Porcentaje de seguridad en el análisis basado en convergencia de indicadores" />
                </div>
              </div>
            </FlowCard>

            {/* Arrows */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-1 bg-gradient-to-b from-blue-500 to-transparent"></div>
                <ArrowRight className="text-slate-600" size={20} />
              </div>
            </div>

            {/* Step 4 */}
            <FlowCard
              icon={TrendingUp}
              title="4. Generación de Escenarios (IA)"
              description="Combina indicadores + noticias para generar 3 escenarios predictivos con probabilidades"
            >
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded">
                    <p className="font-bold text-emerald-400 text-sm">BULL CASE ↑</p>
                    <p className="text-xs text-emerald-300 mt-1">Mercado al alza. Condiciones favorables para compra de ETF</p>
                  </div>
                  <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded">
                    <p className="font-bold text-amber-400 text-sm">BASE CASE →</p>
                    <p className="text-xs text-amber-300 mt-1">Mercado lateral. Esperar o posiciones defensivas</p>
                  </div>
                  <div className="p-3 bg-red-950/30 border border-red-900/50 rounded">
                    <p className="font-bold text-red-400 text-sm">BEAR CASE ↓</p>
                    <p className="text-xs text-red-300 mt-1">Mercado a la baja. Evitar o cerrar posiciones</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 p-2 bg-slate-950/40 rounded italic">
                  📊 Cada escenario incluye: narrativa, gatillantes de ejecución, rangos proyectados y riesgos de reversión
                </p>
              </div>
            </FlowCard>

            {/* Arrows */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-1 bg-gradient-to-b from-blue-500 to-transparent"></div>
                <ArrowRight className="text-slate-600" size={20} />
              </div>
            </div>

            {/* Step 5 */}
            <FlowCard
              icon={BarChart3}
              title="5. Monitoreo de Patrones"
              description="Se registra cada hora cómo se comportó el bot para identificar patrones y mejorar el sistema"
            >
              <div className="space-y-2">
                <p className="font-semibold text-slate-200 text-sm">Se analiza:</p>
                <div className="space-y-2">
                  <FeatureItem label="Horas de Mayor Actividad" description="¿A qué horas el bot genera más señales correctas?" />
                  <FeatureItem label="Calidad de Señales" description="Relación entre confianza de la señal y su exactitud" />
                  <FeatureItem label="Patrones Semanales" description="¿Hay días específicos más predecibles?" />
                </div>
              </div>
            </FlowCard>
          </div>
        </section>

        {/* Componentes del Sistema */}
        <section className="space-y-6 pt-8 border-t border-slate-800/60">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Eye className="text-blue-400" size={28} />
              Páginas del Sistema
            </h2>
            <p className="text-slate-400 text-sm">Qué puedes ver en cada pantalla</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semáforo */}
            <Link href="/" className="group">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Activity className="text-blue-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
                      1. Semáforo (Inicio)
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Visualización en tiempo real del contexto de mercado basado en indicadores actuales.
                    </p>
                    <div className="space-y-2 text-xs text-slate-300 mb-4">
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        Indicadores actuales (VIX, WTI, DXY, etc.)
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        Risk Score actual
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        Nivel de confianza del análisis
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:gap-3 transition-all">
                      Ver Semáforo <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Proyecciones */}
            <Link href="/escenarios" className="group">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-500/50 transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <TrendingUp className="text-emerald-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">
                      2. Proyecciones de Escenarios
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Las 3 predicciones generadas por IA basadas en indicadores + noticias filtradas.
                    </p>
                    <div className="space-y-2 text-xs text-slate-300 mb-4">
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Bull Case, Base Case, Bear Case
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Probabilidades y narrativas
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Rangos proyectados por indicador
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
                      Ver Escenarios <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Análisis */}
            <Link href="/analisis" className="group">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:border-amber-500/50 transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <BarChart3 className="text-amber-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">
                      3. Análisis de Patrones
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Histórico y análisis de cómo se ha comportado el bot a lo largo del tiempo.
                    </p>
                    <div className="space-y-2 text-xs text-slate-300 mb-4">
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        Patrones por hora y día
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        Evolución de indicadores
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        Correlación confianza vs riesgo
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold group-hover:gap-3 transition-all">
                      Ver Análisis <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Documentación */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <AlertCircle className="text-blue-400" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100 mb-2">
                    4. Documentación (Aquí)
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Explicación completa del sistema, cómo funciona y qué esperar de cada componente.
                  </p>
                  <div className="space-y-2 text-xs text-slate-300 mb-4">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Flujo de datos completo
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Interpretación de resultados
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Guía de uso
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo interpretar */}
        <section className="space-y-6 pt-8 border-t border-slate-800/60">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Cómo Interpretar los Resultados
            </h2>
            <p className="text-slate-400 text-sm">Guía para tomar decisiones basadas en los datos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Score */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-400" size={20} />
                Risk Score
              </h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-red-950/30 border border-red-900/50 rounded">
                  <p className="font-semibold text-red-300">≥ 70: Alto Riesgo</p>
                  <p className="text-xs text-red-400 mt-1">No invertir. Esperar contexto más favorable</p>
                </div>
                <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded">
                  <p className="font-semibold text-amber-300">40-69: Riesgo Moderado</p>
                  <p className="text-xs text-amber-400 mt-1">Invertir con cautela. Posiciones pequeñas</p>
                </div>
                <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded">
                  <p className="font-semibold text-emerald-300">&lt; 40: Bajo Riesgo</p>
                  <p className="text-xs text-emerald-400 mt-1">Contexto favorable. Aumentar posiciones</p>
                </div>
              </div>
            </div>

            {/* Confianza */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={20} />
                Nivel de Confianza
              </h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded">
                  <p className="font-semibold text-emerald-300">≥ 80%: Muy Confiable</p>
                  <p className="text-xs text-emerald-400 mt-1">Múltiples indicadores convergen. Actuar con confianza</p>
                </div>
                <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded">
                  <p className="font-semibold text-blue-300">60-79%: Confiable</p>
                  <p className="text-xs text-blue-400 mt-1">Señal válida pero no perfecta. Proceder</p>
                </div>
                <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded">
                  <p className="font-semibold text-amber-300">&lt; 60%: Baja Confianza</p>
                  <p className="text-xs text-amber-400 mt-1">Esperar más indicadores. Evitar decisiones grandes</p>
                </div>
              </div>
            </div>

            {/* Escenarios */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 backdrop-blur-sm md:col-span-2">
              <h4 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-400" size={20} />
                Interpretar Escenarios
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded">
                  <p className="font-bold text-emerald-400 mb-2">BULL CASE (Alcista) ↑</p>
                  <ul className="space-y-1 text-xs text-emerald-300">
                    <li>• Condiciones favorables para compra</li>
                    <li>• Indicadores convergen hacia el alza</li>
                    <li>• Noticias apoyan movimiento positivo</li>
                    <li><strong>Acción:</strong> Comprar ETF defensivos o de crecimiento</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-950/30 border border-amber-900/50 rounded">
                  <p className="font-bold text-amber-400 mb-2">BASE CASE (Neutral) →</p>
                  <ul className="space-y-1 text-xs text-amber-300">
                    <li>• Mercado indeciso</li>
                    <li>• Indicadores mixtos</li>
                    <li>• Esperar claridad antes de actuar</li>
                    <li><strong>Acción:</strong> Mantener posiciones o liquidez</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-950/30 border border-red-900/50 rounded">
                  <p className="font-bold text-red-400 mb-2">BEAR CASE (Bajista) ↓</p>
                  <ul className="space-y-1 text-xs text-red-300">
                    <li>• Riesgo elevado de caída</li>
                    <li>• Indicadores convergen hacia la baja</li>
                    <li>• Noticias advierten problemas</li>
                    <li><strong>Acción:</strong> Reducir posiciones o esperar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow de Uso */}
        <section className="space-y-6 pt-8 border-t border-slate-800/60">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Flujo de Trabajo Recomendado
            </h2>
            <p className="text-slate-400 text-sm">Cómo usar el sistema para tomar decisiones de inversión</p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Revisar el Semáforo",
                description: "Abre la página de inicio para ver el contexto actual del mercado. Observa Risk Score y Confianza.",
                action: "Entrada"
              },
              {
                step: "2",
                title: "Analizar Escenarios",
                description: "Ve a Proyecciones y lee los 3 escenarios. Enfócate en el que tiene mayor probabilidad.",
                action: "Análisis"
              },
              {
                step: "3",
                title: "Revisar Patrones Históricos",
                description: "Abre Análisis de Patrones para ver si hay sesgo histórico o patrones en horarios específicos.",
                action: "Validación"
              },
              {
                step: "4",
                title: "Tomar Decisión",
                description: "Combina: contexto actual + escenarios + patrones históricos. Decide si invertir y en qué proporción.",
                action: "Decisión"
              },
              {
                step: "5",
                title: "Monitorear",
                description: "Vuelve a revisar cada hora durante mercado abierto. Ajusta si los gatillantes de reversión se activan.",
                action: "Monitoreo"
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  {item.step !== "5" && <div className="w-0.5 h-12 bg-slate-700 mt-2"></div>}
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex-1 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      {item.action}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6 pt-8 border-t border-slate-800/60">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "¿Cuál es la mejor hora para invertir?",
                a: "Abre Análisis de Patrones y busca la hora con mayor consistencia de señales acertadas. Generalmente las primeras horas (9-11am) y últimas horas (14-16pm) tienen mayor volatilidad predecible."
              },
              {
                q: "¿Qué hago si Risk Score es alto pero escenario Bull?",
                a: "Significa que hay oportunidad pero con riesgo. Invierte menos cantidad o espera a que Risk Score baje mientras la tendencia sigue siendo alcista."
              },
              {
                q: "¿Cuánto dinero debo invertir cada vez?",
                a: "Usa el Risk Score como guía: Risk bajo (0-40) = inversión normal. Risk moderado (40-70) = reduce 30-50%. Risk alto (70+) = espera o posición mínima."
              },
              {
                q: "¿Qué significa 'Gatillante de Ejecución'?",
                a: "Es el evento o precio específico que confirmaría el escenario. Ej: 'Si VIX sube por encima de 25' o 'Si cobre cae 2%'. Es tu señal para ejecutar."
              },
              {
                q: "¿Con qué frecuencia revisar el sistema?",
                a: "El bot actualiza cada hora durante mercado (9am-4pm aprox). Revisa mínimo 2-3 veces al día. Ideal es revisar antes de comprar o si hay noticias importantes."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
                <h4 className="font-bold text-slate-100 text-sm mb-2">❓ {faq.q}</h4>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-8 border-t border-slate-800/60 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Zap size={14} className="text-blue-400" />
            <span className="text-xs font-mono text-blue-300 uppercase tracking-widest">Sistema Completamente Automatizado</span>
          </div>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            Este sistema combina análisis técnico, noticias filtradas por IA y machine learning para generar predicciones de mercado. 
            <strong className="text-slate-400"> Es una herramienta de apoyo, no reemplazo de análisis financiero profesional.</strong>
          </p>
          <p className="text-slate-600 text-xs uppercase tracking-widest font-mono">
            Riesgo: Toda inversión en mercados tiene riesgo. El sistema ayuda a mitigarlo pero no lo elimina.
          </p>
        </footer>
      </div>
    </div>
  );
}
