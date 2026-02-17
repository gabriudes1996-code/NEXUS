import React from 'react';

const steps = [
  {
    title: 'Alinhamento Estratégico',
    description: 'Diagnóstico profundo do portfólio da empresa e definição dos canais prioritários de venda governamental.',
    number: '01',
    color: 'from-[#0A2342] to-[#051221]',
    shadow: 'shadow-slate-900/30'
  },
  {
    title: 'Análise de Viabilidade',
    description: 'Estudo técnico-jurídico de editais para garantir que a participação seja segura e comercialmente viável.',
    number: '02',
    color: 'from-[#C5A059] to-[#E5C789]',
    shadow: 'shadow-[#C5A059]/20'
  },
  {
    title: 'Segurança Documental',
    description: 'Rigidez absoluta na conferência e montagem do acervo de habilitação para evitar desclassificações.',
    number: '03',
    color: 'from-[#0A2342] to-[#051221]',
    shadow: 'shadow-slate-900/30'
  },
  {
    title: 'Representação Técnica',
    description: 'Participação ativa na fase de lances e negociação direta com a administração pública em nome do cliente.',
    number: '04',
    color: 'from-[#C5A059] to-[#E5C789]',
    shadow: 'shadow-[#C5A059]/20'
  }
];

const Process: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#0A2342]/20 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-[#C5A059] font-black uppercase tracking-[0.4em] text-[10px] mb-6">Nossa Metodologia Nexus</h2>
          <h3 className="text-5xl font-black text-white tracking-tighter">Processos desenhados para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E5C789] italic font-heading">ganhar</span>.</h3>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/20 to-[#0A2342]/0 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-[2rem] flex items-center justify-center text-2xl font-black ${index % 2 === 0 ? 'text-[#C5A059]' : 'text-[#0A2342]'} mb-8 shadow-2xl ${step.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ring-8 ring-slate-900/50 border border-[#C5A059]/20`}>
                  {step.number}
                </div>
                <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-[#C5A059] transition-colors">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed px-4 font-medium">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 rounded-2xl border border-[#C5A059]/20 text-slate-300 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
            Metodologia certificada e focada em resultados exponenciais.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;