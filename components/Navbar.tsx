import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

interface NavbarProps {
  // Fix: Updated onLoginSuccess to accept isAdmin boolean to match handleLoginSuccess signature in App.tsx
  onLoginSuccess?: (isAdmin: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Início', id: 'home' },
    { name: 'Serviços', id: 'services' },
    { name: 'Como Funciona', id: 'how-it-works' },
    { name: 'Contato', id: 'contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center">
              <a 
                href="#home" 
                onClick={(e) => scrollToSection(e, 'home')}
                className="flex-shrink-0 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-2xl shadow-blue-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className={`text-2xl font-black tracking-tighter uppercase transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>Nexus</span>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-0.5">Assessoria</span>
                </div>
              </a>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-12">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className={`text-sm font-black transition-all uppercase tracking-widest relative group ${scrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
                  >
                    {link.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all group-hover:w-full rounded-full"></span>
                  </a>
                ))}
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-3 group"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Área do Cliente
                </button>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-xl transition-colors ${scrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'}`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-fade-in absolute top-full left-0 w-full">
            <div className="px-6 pt-6 pb-10 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="block px-6 py-5 rounded-2xl text-base font-black text-slate-700 uppercase tracking-widest hover:text-blue-600 hover:bg-blue-50 transition-all"
                  onClick={(e) => scrollToSection(e, link.id)}
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginOpen(true);
                }}
                className="w-full px-6 py-6 mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] text-center font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Área do Cliente
              </button>
            </div>
          </div>
        )}
      </nav>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={onLoginSuccess}
      />
    </>
  );
};

export default Navbar;