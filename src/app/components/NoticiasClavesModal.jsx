"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { X, Calendar, ExternalLink } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function stripMarkdown(text) {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
}

export default function NoticiasClavesModal({ isOpen, onClose, noticias_clave }) {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !noticias_clave) return;

    const indices = noticias_clave
      .split(",")
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("telemetria_noticias")
          .select("*")
          .order("fecha_publicacion", { ascending: false });

        const noticiasEnumeradas = data.map((noticia, idx) => ({
          ...noticia,
          numero: idx + 1,
        }));

        const noticiasFiltered = noticiasEnumeradas.filter(n =>
          indices.includes(n.numero)
        );

        const noticiasOrdenadas = noticiasFiltered.sort(
          (a, b) => indices.indexOf(a.numero) - indices.indexOf(b.numero)
        );

        setNoticias(noticiasOrdenadas);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, noticias_clave]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-slate-100">Noticias Clave</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              Cargando noticias...
            </div>
          ) : noticias.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No se encontraron noticias
            </div>
          ) : (
            noticias.map((noticia, idx) => {
              const fecha = new Date(noticia.fecha_publicacion);
              const fechaStr = fecha.toLocaleDateString("es-CL", {
                day: "2-digit",
                month: "short",
              });

              return (
                <div
                  key={noticia.id}
                  className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-400 rounded text-xs font-bold">
                      #{noticia.numero}
                    </span>
                    <span className="text-xs text-slate-500 uppercase">
                      {noticia.medio}
                    </span>
                  </div>
              
                  {/* El titular ahora es el enlace */}
                  <h4 className="font-bold text-slate-100 text-sm mb-2 leading-tight">
                    {noticia.enlace ? (
                      <a
                        href={noticia.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                      >
                        {noticia.titular}
                        <ExternalLink 
                          size={14} 
                          className="inline-block opacity-50 group-hover:opacity-100 transition-opacity" 
                        />
                      </a>
                    ) : (
                      noticia.titular
                    )}
                  </h4>
              
                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                    <Calendar size={12} />
                    {fechaStr}
                  </p>
              
                  {noticia.resumen_ia && (
                    <p className="text-xs text-slate-300 mb-3">
                      {stripMarkdown(noticia.resumen_ia).substring(0, 150)}...
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}