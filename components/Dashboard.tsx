import React, { useState } from 'react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('licitacoes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = [
    { label: 'Editais Monitorados', value: '142', trend: '+12 hoje', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', color: 'text-blue-600' },
    { label: 'Participações Ativas', value: '18', trend: '3 em fase de lances', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-amber-600' },
    { label: 'Vitórias (Maio)', value: '06', trend: 'R$ 840k total', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', color: 'text-green-600' },
    { label: 'Documentação', value: '98%', trend: 'Atualizada', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-indigo-600' },
  ];

  const licitacoes = [
    { id: '445/2024', orgao: 'Prefeitura de São Paulo', objeto: 'Materiais de Escritório Sustentáveis', valor: 'R$ 450.000,00', status: 'Em Análise', data: '22/05' },
    { id: '102/2024', orgao: 'Câmara Municipal do Rio', objeto: 'Serviços de Cloud Computing', valor: 'R$ 1.2M', status: 'Habilitado', data: '18/05' },
    { id: '89/2024', orgao: 'Gov. de Minas Gerais', objeto: 'Mobiliário Escolar Premium', valor: 'R$ 890k', status: 'Vencida', data: '15/05' },
    { id: '312/2024', orgao: 'TRT 2ª Região', objeto: 'Manutenção Preventiva TI', valor: 'R$ 210k', status: 'Lances', data: '25/05' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* Modern Sidebar */}
      <aside className={`bg-[#0F172A] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {isSidebarOpen && <span className="font-black text-lg tracking-tight">Nexus <span className="text-blue-500">Studio</span></span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { id: 'licitacoes', label: 'Licitações', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2' },
            { id: 'resultados', label: 'Resultados', icon: 'M16 8v8m-4-5v5M8 13v3m7 4h9a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2h9z' },
            { id: 'docs', label: 'Habilitação', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          {isSidebarOpen && (
            <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plano Corporate</p>
              <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[85%]"></div>
              </div>
            </div>
          )}
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span>Sair do Painel</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar with glassmorphism */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-lg bg-slate-50 lg:block hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Painel Estratégico <span className="text-blue-600">Azul Papel</span></h2>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden md:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input type="text" placeholder="Filtrar dados..." className="bg-slate-50 border-none rounded-lg text-xs py-2 pl-9 pr-4 w-48 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-black border border-white shadow-sm overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Azul+Papel&background=DBEAFE&color=1D4ED8&bold=true" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-[1200px] mx-auto space-y-10 animate-fade-in">
            
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Visão Geral de Performance</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Resumo de <span className="text-blue-600">Junho</span></h3>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Exportar Bi
                </button>
                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Monitorar Edital
                </button>
              </div>
            </div>

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-10 h-10 bg-slate-50 group-hover:bg-blue-50 transition-colors flex items-center justify-center rounded-xl ${stat.color}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                      </svg>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{stat.trend}</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main Section: Monitoring Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <h5 className="font-black text-sm text-slate-900 uppercase tracking-widest">Processos em Monitoramento</h5>
                  <button className="text-blue-600 text-[10px] font-black uppercase hover:underline">Ver Histórico</button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Órgão / Objeto</th>
                        <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Valor Estimado</th>
                        <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status Nexus</th>
                        <th className="px-8 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {licitacoes.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <p className="text-[11px] font-black text-slate-900 uppercase leading-none mb-1 group-hover:text-blue-600 transition-colors">{row.orgao}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{row.objeto}</p>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="text-xs font-bold text-slate-900">{row.valor}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                              row.status === 'Habilitado' ? 'bg-blue-100 text-blue-700' :
                              row.status === 'Lances' ? 'bg-amber-100 text-amber-700' :
                              row.status === 'Vencida' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="text-slate-200 hover:text-slate-400 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar Action Cards */}
              <div className="space-y-6">
                <div className="bg-[#111827] rounded-[2rem] p-8 text-white relative overflow-hidden group border border-slate-800">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Próximo Pregão</p>
                    <h5 className="text-xl font-black mb-1 leading-tight">TRE-SP <br/>Serviços de Nuvem</h5>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-4 mb-8">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                       Inicia em 14:30h
                    </div>
                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95">Abrir Sala Virtual</button>
                  </div>
                  <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none transition-transform group-hover:scale-110">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                   <h5 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Consultor Vinculado</h5>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                       <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" alt="Consultor" className="grayscale hover:grayscale-0 transition-all cursor-pointer" />
                     </div>
                     <div>
                       <p className="text-[11px] font-black text-slate-900 uppercase">Ricardo Mendes</p>
                       <div className="flex items-center gap-1.5 mt-0.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Online para Suporte</span>
                       </div>
                     </div>
                   </div>
                   <button className="w-full mt-6 py-4 border border-slate-100 hover:border-blue-100 hover:bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Atendimento Direto</button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Studio Footer */}
        <footer className="p-8 text-center bg-white/50 border-t border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Ambiente Nexus Studio © 2024 • Acesso via VPN (AES-256)</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;