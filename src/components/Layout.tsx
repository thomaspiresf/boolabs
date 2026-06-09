import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useLeadModal } from '../context/LeadModalContext';

const FlagBR = () => (
  <svg width="18" height="14" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-[2px] shadow-sm opacity-90">
    <rect width="36" height="24" fill="#009B3A"/>
    <path d="M18 3L32 12L18 21L4 12L18 3Z" fill="#FEDF00"/>
    <circle cx="18" cy="12" r="5.5" fill="#002776"/>
  </svg>
);

const FlagUS = () => (
  <svg width="18" height="14" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-[2px] shadow-sm opacity-90">
    <rect width="36" height="24" fill="#B22234"/>
    <rect y="3" width="36" height="3" fill="white"/>
    <rect y="9" width="36" height="3" fill="white"/>
    <rect y="15" width="36" height="3" fill="white"/>
    <rect y="21" width="36" height="3" fill="white"/>
    <rect width="16" height="13" fill="#3C3B6E"/>
    <circle cx="3" cy="3" r="0.8" fill="white"/>
    <circle cx="8" cy="3" r="0.8" fill="white"/>
    <circle cx="13" cy="3" r="0.8" fill="white"/>
    <circle cx="5.5" cy="6.5" r="0.8" fill="white"/>
    <circle cx="10.5" cy="6.5" r="0.8" fill="white"/>
    <circle cx="3" cy="10" r="0.8" fill="white"/>
    <circle cx="8" cy="10" r="0.8" fill="white"/>
    <circle cx="13" cy="10" r="0.8" fill="white"/>
  </svg>
);

interface LayoutProps {
  children: ReactNode;
}

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const { openLeadModal } = useLeadModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'pt' : 'en');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-[5vw] h-[52px] flex items-center justify-between transition-all duration-300 ${
      scrolled 
        ? "bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm" 
        : "bg-white border-b border-gray-100"
    }`}>
      <Link to="/" className="flex items-center gap-2 no-underline">
        <img src="/Logo-Boo-Default.svg" alt="boo" className="h-6 md:h-8 w-auto" />
      </Link>
      
      <ul className="hidden md:flex gap-10 list-none">
        <li><Link to="/#como-funciona" className="text-[var(--muted)] no-underline text-xs tracking-widest hover:text-[var(--foreground)] transition-colors">{t('nav.how_it_works')}</Link></li>
        <li><Link to="/#capacidades" className="text-[var(--muted)] no-underline text-xs tracking-widest hover:text-[var(--foreground)] transition-colors">{t('nav.technology')}</Link></li>
        <li><Link to="/#ecossistema" className="text-[var(--muted)] no-underline text-xs tracking-widest hover:text-[var(--foreground)] transition-colors">{t('nav.ecosystem')}</Link></li>
        <li><Link to="/quem-somos" className="text-[var(--muted)] no-underline text-xs tracking-widest hover:text-[var(--foreground)] transition-colors">{t('nav.about')}</Link></li>
        <li><Link to="/blog" className="text-[var(--muted)] no-underline text-xs tracking-widest hover:text-[var(--foreground)] transition-colors">{t('nav.blog')}</Link></li>
      </ul>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent"
        >
          {i18n.language === 'en' ? (
            <><FlagUS /> EN</>
          ) : (
            <><FlagBR /> PT</>
          )}
        </button>

        {!isHome ? (
          <Link to="/" className="bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--foreground)] px-5 py-2 rounded-md text-xs font-normal tracking-wide hover:bg-white/40 transition-all flex items-center gap-2">
            <ArrowLeft size={14} /> {t('nav.back')}
          </Link>
        ) : (
          <button 
            onClick={() => openLeadModal(t('nav.organize_data'))}
            className="bg-[#21659F] text-white px-5 py-2 rounded-md text-xs font-normal tracking-wide hover:opacity-90 transition-all flex items-center gap-2 shadow-sm border-none cursor-pointer"
          >
            {t('nav.organize_data')} <ChevronRight size={14} />
          </button>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-[#f3f4f9] text-gray-600 pt-16 pb-8 px-[5vw] border-t border-gray-200/60">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {/* Coluna 1: Logo & Slogan */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="inline-block">
            <img src="/Logo-Boo-Default.svg" alt="boo" className="h-8 w-auto" />
          </Link>
          <div className="space-y-1 text-sm text-gray-500 leading-relaxed font-light font-sans">
            <p>{t('footer.slogan1')}</p>
            <p>{t('footer.slogan2')}</p>
          </div>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div className="flex flex-col space-y-3 font-light text-[15px] font-sans">
          <Link to="/quem-somos" className="text-gray-500 hover:text-slate-900 transition-colors no-underline">
            {t('footer.about')}
          </Link>
          <a href="/#como-funciona" className="text-gray-500 hover:text-slate-900 transition-colors no-underline">
            {t('footer.what_we_do')}
          </a>
          <a href="/#ecossistema" className="text-gray-500 hover:text-slate-900 transition-colors no-underline">
            {t('footer.products')}
          </a>
          <Link to="/politica-de-privacidade" className="text-gray-500 hover:text-slate-900 transition-colors no-underline">
            {t('footer.privacy')}
          </Link>
          <Link to="/blog" className="text-gray-500 hover:text-slate-900 transition-colors no-underline">
            {t('footer.blog')}
          </Link>
          <Link to="/suporte" className="text-gray-500 hover:text-slate-900 transition-colors no-underline">
            {t('footer.support')}
          </Link>
        </div>

        {/* Coluna 3: Contatos e Redes Sociais */}
        <div className="flex flex-col space-y-3 md:items-end text-sm font-light font-sans">
          <a href="mailto:contato@boolabs.com.br" className="text-gray-500 hover:text-slate-900 transition-colors no-underline">
            contato@boolabs.com.br
          </a>
          <a
            href="https://www.linkedin.com/company/boolabs/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-slate-900 transition-colors no-underline group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-colors"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
          <a
            href="https://www.instagram.com/boo_labs/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-slate-900 transition-colors no-underline group"
          >
            <Instagram size={16} className="text-gray-400 group-hover:text-slate-900 transition-colors" />
            <span>Instagram</span>
          </a>
        </div>
      </div>

      {/* Linha Divisória & Copyright */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200/60 text-center font-sans">
        <p className="text-xs text-gray-400 font-light">
          &copy; {new Date().getFullYear()} boo. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
};

const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Helper de testes para limpar o consentimento e exibir o banner novamente
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('reset_cookies') === 'true' || window.location.hash === '#reset-cookies') {
      localStorage.removeItem('boo_cookies_consent');
    }

    const consent = localStorage.getItem('boo_cookies_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleAccept = () => {
    localStorage.setItem('boo_cookies_consent', 'accepted');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 z-50 max-w-[290px] bg-white border border-slate-200/50 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)] select-none"
        >
          <div className="flex items-center gap-2.5">
            <p className="text-[11px] text-slate-500 leading-tight font-light flex-1">
              {t('cookies.text')} <Link to="/politica-de-privacidade" className="text-slate-900 hover:text-[#46AAFF] transition-colors font-normal no-underline border-b border-slate-300">{t('cookies.policy')}</Link>.
            </p>
            <button
              onClick={handleAccept}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 text-white rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
            >
              {t('cookies.ok')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
};
