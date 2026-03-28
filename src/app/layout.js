import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Radar Táctico Einsoft",
  description: "Radar Táctico Einsoft: Motor cuantitativo impulsado por IA (Gemini) y n8n. Analiza telemetría macroeconómica global (VIX, Oro, WTI) y local (UF) en tiempo real para evaluar el riesgo sistémico. Emite órdenes de ejecución financiera sin emociones frente a posibles Cisnes Negros. Frontend táctico construido con Next.js, Tailwind y Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
