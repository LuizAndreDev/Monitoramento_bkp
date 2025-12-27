'use client'
import { Activity, ArrowRight, Database, Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    // Fundo Complexo estilo Tier 11
    <div className="min-h-screen bg-[#0B1120] text-white selection:bg-postgres selection:text-white overflow-hidden relative">
      
      {/* Elementos de Fundo (Luzes/Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-postgres/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="bg-postgres/20 p-2 rounded-lg border border-postgres/30">
            <Database className="text-postgres-light" size={24} />
          </div>
          <span>VR<span className="text-postgres-light">MONITOR</span></span>
        </div>
        <Link 
          href="/login" 
          className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-medium text-sm backdrop-blur-md"
        >
          Área do Cliente
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 flex flex-col items-center text-center relative z-10">
        
        {/* Badge Animado */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Sistema Online v2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in">
          Monitoramento de Backup <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
            Inteligente & Seguro.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-fade-in delay-100">
          Garanta a integridade dos dados dos seus clientes PostgreSQL com validação em tempo real e auditoria automatizada.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
          <Link 
            href="/login" 
            className="group relative px-8 py-4 bg-postgres hover:bg-postgres-dark text-white rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(51,103,145,0.3)] flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Acessar Painel</span>
            <ArrowRight className="relative group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>

        {/* Features Cards (Glassmorphism) */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 w-full max-w-6xl text-left">
          {[
            { icon: ShieldCheck, color: "text-emerald-400", title: "Integridade Garantida", desc: "Validação automática (pg_restore) em cada arquivo gerado." },
            { icon: Lock, color: "text-blue-400", title: "Segurança Máxima", desc: "Criptografia ponta a ponta e logs auditáveis imutáveis." },
            { icon: Activity, color: "text-purple-400", title: "Tempo Real", desc: "Dashboard ao vivo com alertas de atraso e falha." }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-[#162032]/50 border border-white/5 hover:border-white/10 hover:bg-[#162032] transition-all duration-300 group">
              <feature.icon className={`${feature.color} mb-5 group-hover:scale-110 transition-transform`} size={32} />
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="w-full border-t border-white/5 mt-20 py-8 text-center text-slate-600 text-sm">
        <p>&copy; 2025 VR Software &bull; Powered by PostgreSQL</p>
      </footer>
    </div>
  )
}