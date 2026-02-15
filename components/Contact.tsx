
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Obrigado pelo contato! Nossa equipe retornará em breve.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-blue-600 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-200">
          {/* Background Image for Contact Card - Temática: Assinatura de Contratos */}
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000" 
              alt="Assinatura de Contrato Público" 
              className="w-full h-full object-cover opacity-15 mix-blend-overlay"
            />
          </div>

          <div className="grid lg:grid-cols-2 relative z-10">
            <div className="p-12 lg:p-20 text-white flex flex-col justify-center">
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">Vamos começar a vencer hoje?</h2>
              <p className="text-blue-100 text-lg mb-10 font-medium">
                Agende uma conversa gratuita com um de nossos especialistas em licitações e descubra o potencial de faturamento que sua empresa está perdendo.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/50 backdrop-blur-md rounded-xl flex items-center justify-center border border-blue-400/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm font-bold uppercase tracking-wider">E-mail</p>
                    <p className="font-bold">contato@nexusassessoria.com.br</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/50 backdrop-blur-md rounded-xl flex items-center justify-center border border-blue-400/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm font-bold uppercase tracking-wider">WhatsApp</p>
                    <p className="font-bold">+55 (11) 99999-9999</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-12 lg:p-20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 font-medium"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">E-mail Corporativo</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 font-medium"
                      placeholder="joao@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nome da Empresa</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 font-medium"
                      placeholder="Minha Empresa LTDA"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Como podemos ajudar?</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 font-medium"
                    placeholder="Conte-nos brevemente sobre seu negócio..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                >
                  Enviar Mensagem
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
