"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ChevronLeft, ExternalLink, Calendar, Newspaper } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1");
}

export default function NoticiasClavePageWrapper() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indicesRequeridos, setIndicesRequeridos] = useState([]);

  useEffect(() => {
    // Obtener índices de la URL (query string)
    const params = new URLSearchParams(window.location.search);
    const indicesStr = params.get("indices");
    
    if (!indicesStr) {
      setError("No se especificaron noticias clave");
      setLoading(false);
      return;
    }

    const indices = indicesStr
      .split(",")
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    setIndicesRequeridos(indices);

    // Buscar todas las noticias y filtrar por índice
    (async () => {
      try {
        const { data, error } = await supabase
          .from("telemetria_noticias")
          .select("*")
          .order("fecha_publicacion", { ascending: false });

        if (error) throw error;

        // Enumerar y filtrar por índices requeridos
        const noticiasEnumeradas = data.map((noticia, idx) => ({
          ...noticia,
          numero: idx + 1,
        }));

        const noticiasFiltered = noticiasEnumeradas.filter(n =>
          indices.includes(n.numero)
        );

        // Ordenar por índice especificado
        const noticiasOrdenadas = noticiasFiltered.sort(
          (a, b) => indices.indexOf(a.numero) - indices.indexOf(b.numero)
        );

        setNoticias(noticiasOrdenadas);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="flex gap-2 justify-center mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
            Cargando noticias...
          </p>
        </div>
      </div>
    );
  }

  if (error || noticias.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="bg-red-950/30 border border-red-900 text-red-400 font-mono p-8 rounded-xl max-w-lg text-center">
          <p className="mb-6">{error || "No se encontraron noticias clave."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
            Volver al Radar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="border-b border-slate-800/60 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Newspaper className="text-blue-500" />
              NOTICIAS CLAVE
            </h1>
          </div>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-medium ml-14">
            {noticias.length} artículos que impulsan los escenarios
          </p>
        </header>

        {/* Noticias */}
        <div className="space-y-4">
          {noticias.map((noticia, idx) => {
            const fecha = new Date(noticia.fecha_publicacion);
            const fechaStr = fecha.toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            const horaStr = fecha.toLocaleTimeString("es-CL", {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Color del badge según índice
            const colores = [
              "bg-emerald-950 border-emerald-700 text-emerald-400",
              "bg-blue-950 border-blue-700 text-blue-400",
              "bg-amber-950 border-amber-700 text-amber-400",
              "bg-purple-950 border-purple-700 text-purple-400",
              "bg-pink-950 border-pink-700 text-pink-400",
            ];
            const colorIdx = idx % colores.length;

            return (
              <div
                key={noticia.id}
                className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors group"
              >
                {/* Header de noticia */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-grow">
                    {/* Badge de índice + Medio */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase ${colores[colorIdx]}`}
                      >
                        #{noticia.numero}
                      </span>
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                        {noticia.medio}
                      </span>
                    </div>

                    {/* Titular */}
                    <h3 className="text-xl md:text-2xl font-bold text-slate-100 leading-tight mb-3 group-hover:text-white transition-colors">
                      {noticia.titular}
                    </h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <Calendar size={14} />
                      <span>{fechaStr} · {horaStr}</span>
                    </div>
                  </div>

                  {/* Botón enlace */}
                  {noticia.enlace && (
                    <a
                      href={noticia.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors"
                    >
                      <ExternalLink size={16} />
                      Leer Original
                    </a>
                  )}
                </div>

                {/* Resumen IA (si existe) */}
                {noticia.resumen_ia && (
                  <div className="mt-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                    <h4 className="text-xs tracking-[0.2em] text-slate-500 uppercase font-bold mb-2">
                      Síntesis IA
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {stripMarkdown(noticia.resumen_ia)}
                    </p>
                  </div>
                )}

                {/* Contenido completo (si existe) */}
                {noticia.contenido && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-300 transition-colors">
                      ▼ Ver contenido completo
                    </summary>
                    <div className="mt-3 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50 text-sm text-slate-400 leading-relaxed whitespace-pre-wrap overflow-hidden max-h-48 overflow-y-auto">
                      {stripMarkdown(noticia.contenido)}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800/60 text-center">
          <p className="text-xs tracking-widest text-slate-600 uppercase font-mono">
            Noticias de fuentes públicas · Actualizado automáticamente
          </p>
        </footer>
      </div>
    </div>
  );
}