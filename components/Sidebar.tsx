import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isAdmin }) => {
  // Define menu items based on user role
  const menuItems = isAdmin
    ? [
      {
        id: 'admin',
        label: 'Console Azultec',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
      }
    ]
    : [
      { id: 'monitor', label: 'Monitor Inteligente', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { id: 'history', label: 'Histórico', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 'calendar', label: 'Agenda Operacional', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { id: 'performance', label: 'Desempenho Anual', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    ];

  return (
    <aside className="w-20 lg:w-80 bg-[#020617] border-r border-white/5 flex flex-col transition-all z-50">
      <div className="p-10 flex items-center gap-5">
        <div className="w-20 h-20 flex items-center justify-center overflow-hidden group-hover:rotate-6 transition-transform">
          <img src="/logo-nexus.png.png" alt="Nexus Logo" className="w-full h-full object-contain scale-125" />
        </div>
        <div className="hidden lg:block">
          <span className="text-white font-black text-2xl tracking-tighter block leading-none font-heading uppercase">NEXUS</span>
          <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.45em] mt-1.5 block">Assessoria</span>
        </div>
      </div>

      <nav className="flex-1 px-6 mt-16 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] text-sm font-bold transition-all relative group ${activeTab === item.id
              ? 'bg-[#C5A059] text-[#0A2342] shadow-2xl shadow-[#C5A059]/20'
              : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
          >
            <svg className={`w-6 h-6 flex-shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="hidden lg:block uppercase tracking-[0.2em] text-[10px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8">
        {!isAdmin && (
          <div className="hidden lg:block mb-10 p-7 bg-white/5 rounded-[2.5rem] border border-[#C5A059]/10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center font-black text-xs text-[#C5A059] border border-[#C5A059]/20 shadow-xl">AZ</div>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-widest">Azul Papel LTDA</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Licitação Enterprise</p>
              </div>
            </div>
            <button className="w-full py-3.5 bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all">Minha Empresa</button>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all group"
        >
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden lg:block">Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;