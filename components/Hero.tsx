import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const Hero: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, capital: 'R$ 0,00' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('licitacoes')
          .select('valor, valor_ganho, resultado')
          .eq('empresa', 'Azul Papel');

        if (data) {
          const totalRealized = data.length;
          // Calculate volume based on 'valor_ganho' for won auctions, similar to App.tsx
          const totalWonValue = data
            .reduce((acc, curr) => acc + (curr.valor_ganho || 0), 0);

          setStats({
            total: totalRealized,
            capital: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalWonValue)
          });
        }
      } catch (error) {
        console.error('Error fetching hero stats:', error);
      }
    };

    fetchStats();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: id === 'home' ? 0 : offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
      {/* Background Blobs for Color */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-[#0A2342]/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#C5A059]/5 rounded-full blur-[150px] rotate-12"></div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000"
          alt="Licitações e Contratos Governamentais"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950 to-slate-950"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059]/10 to-[#0A2342]/10 border border-[#C5A059]/20 mb-8 shadow-xl">
              <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Assessoria Premium em Licitações</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-8 tracking-tighter">
              Liderança e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E5C789] to-[#C5A059]">Estratégia</span> em Compras Públicas.
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              A Nexus Assessoria em Licitações provê inteligência técnica e jurídica para empresas que buscam alta performance no mercado governamental brasileiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="px-10 py-5 bg-[#C5A059] text-[#0A2342] rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-[#C5A059]/40 transition-all transform hover:-translate-y-1 flex items-center justify-center"
              >
                Solicitar Consultoria
              </a>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, 'services')}
                className="px-10 py-5 bg-white/5 backdrop-blur-md text-white border border-[#C5A059]/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#C5A059]/10 transition-all flex items-center justify-center transform hover:-translate-y-1"
              >
                Nossos Serviços
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-10 border border-white/10 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>

              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.3em]">Nexus Performance</span>
                  <h3 className="text-white font-black text-2xl uppercase tracking-tighter mt-1">Impacto Real</h3>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#0A2342] to-[#051221] rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/40 border border-[#C5A059]/20">
                  <svg className="w-7 h-7 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>

              <div className="grid gap-8 relative z-10">
                <div className="p-8 bg-white/5 rounded-[2rem] border border-[#C5A059]/10 transition-all hover:bg-white/10 hover:translate-x-2 group">
                  <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-2">Licitações Realizadas</div>
                  <div className="text-5xl font-black text-white tracking-tighter group-hover:text-glow-blue transition-all">{stats.total}<span className="text-[#C5A059]">+</span></div>
                  <div className="mt-4 flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping"></span>
                    Auditado em Tempo Real
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-[#0A2342]/40 to-[#051221]/40 rounded-[2rem] border border-[#C5A059]/20 shadow-2xl transition-all hover:translate-x-2 group">
                  <div className="text-[10px] font-black text-[#E5C789] uppercase tracking-widest mb-2">Capital Gerado</div>
                  <div className="text-5xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">{stats.capital}<span className="text-blue-400"></span></div>
                  <div className="mt-4 flex items-center gap-3 text-xs font-bold text-[#C5A059]/60 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Contratos em Vigor
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;