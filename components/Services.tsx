
import React from 'react';

const modules = [
  {
    title: 'MÓDULO 1 – Inteligência de Mercado',
    items: [
      'Monitoramento diário de portais oficiais',
      'Análise de oportunidades em diversos segmentos',
      'Estudo de atas e concorrentes',
      'Definição de viabilidade estratégica'
    ],
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z',
    color: 'blue'
  },
  {
    title: 'MÓDULO 2 – Análise Técnica e Jurídica',
    items: [
      'Estudo detalhado do Termo de Referência',
      'Análise de exigências de habilitação',
      'Elaboração de esclarecimentos',
      'Impugnações estratégicas'
    ],
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'emerald'
  },
  {
    title: 'MÓDULO 3 – Formação de Preço',
    items: [
      'Levantamento de custos e impostos',
      'Avaliação de risco cambial e logístico',
      'Definição de margem estratégica',
      'Preço mínimo defensável'
    ],
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2',
    color: 'indigo'
  },
  {
    title: 'MÓDULO 4 – Preparação Documental',
    items: [
      'Atualização no SICAF e certidões',
      'Análise de balanço e índices',
      'Organização de atestados técnicos',
      'Proposta comercial formalizada'
    ],
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: 'purple'
  },
  {
    title: 'MÓDULO 5 – Cadastro e Envio',
    items: [
      'Inserção em sistemas eletrônicos',
      'Conferência rigorosa de dados',
      'Anexação segura de documentos',
      'Garantia de conformidade'
    ],
    icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4v12',
    color: 'pink'
  },
  {
    title: 'MÓDULO 6 – Operação de Pregão',
    items: [
      'Acompanhamento em tempo real',
      'Estratégia agressiva de lances',
      'Negociação direta com pregoeiro',
      'Controle de margem mínima'
    ],
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'orange'
  },
  {
    title: 'MÓDULO 7 – Habilitação e Defesa',
    items: [
      'Respostas a diligências técnicas',
      'Interposição de recursos jurídicos',
      'Contrarrazões fundamentadas',
      'Sustentação estratégica'
    ],
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0',
    color: 'rose'
  },
  {
    title: 'MÓDULO 8 – Homologação',
    items: [
      'Acompanhamento de fase recursal',
      'Monitoramento de adjudicação',
      'Confirmação final da vitória'
    ],
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'amber'
  },
  {
    title: 'MÓDULO 9 – Gestão Contratual',
    items: [
      'Análise de minutas e prazos',
      'Gestão de garantias e assinaturas',
      'Reequilíbrio econômico-financeiro',
      'Controle de entregas'
    ],
    icon: 'M16 8v8m-4-5v5M8 13v3m7 4h9a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2h9z',
    color: 'cyan'
  }
];

const colorClasses: Record<string, string> = {
  blue: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  emerald: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  indigo: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  purple: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  pink: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  orange: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  rose: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  amber: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
  cyan: 'text-[#C5A059] bg-[#C5A059]/10 group-hover:bg-[#C5A059]',
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">

          <div className="space-y-8">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-slate-50 p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-transparent hover:border-blue-500/20 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-xl group-hover:text-white group-hover:scale-110 ${colorClasses[module.color]}`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={module.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">{module.title}</h3>
                    <ul className="grid gap-3">
                      {module.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-500 text-sm font-semibold">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0 group-hover:bg-[#C5A059] transition-colors"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-32 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="text-[#C5A059] font-black text-xs uppercase tracking-[0.4em] mb-6 block">Inovação e Assessoria</span>
            <h2 className="text-5xl lg:text-6xl font-black text-[#0A2342] leading-[1.05] mb-10 tracking-tighter">
              A Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E5C789] italic pr-2">conecta</span> sua empresa ao sucesso governamental.
            </h2>

            <div className="space-y-8 text-xl text-slate-500 font-medium leading-relaxed mb-12">
              <p>
                Nossa assessoria digital combina <span className="text-slate-900 font-bold">inteligência de dados</span> com excelência jurídica para garantir que sua empresa não apenas participe, mas vença.
              </p>
              <p>
                Eliminamos a burocracia do caminho, permitindo que sua equipe foque no que realmente importa: <span className="text-[#C5A059] font-bold">a excelência na entrega</span>.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6 p-8 bg-[#0A2342] rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/30 border border-[#C5A059]/20">
              <div className="w-32 h-32 flex items-center justify-center mb-8 overflow-hidden">
                <img src="/logo-nexus.png" alt="Nexus Logo" className="w-full h-full object-contain scale-150" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#E5C789]">Pronto para o próximo nível?</p>
                <p className="text-xl font-black tracking-tight">Sua jornada rumo ao contrato público começa aqui.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
