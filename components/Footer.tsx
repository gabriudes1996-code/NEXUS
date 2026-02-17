
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A2342] border-t border-[#C5A059]/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
              <img src="/logo-nexus.png" alt="Nexus Logo" className="w-full h-full object-contain scale-150" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Nexus <span className="text-[#C5A059]">Assessoria</span></span>
          </div>

          <div className="flex gap-8 text-sm text-[#C5A059]/60">
            <a href="#" className="hover:text-[#C5A059] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#C5A059] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#C5A059] transition-colors">Compliance</a>
          </div>

          <p className="text-sm text-[#C5A059]/40">
            © {new Date().getFullYear()} Nexus Assessoria. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;