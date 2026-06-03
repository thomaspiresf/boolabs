import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface LeadModalContextType {
  openLeadModal: (title?: string) => void;
  closeLeadModal: () => void;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export function useLeadModal() {
  const context = useContext(LeadModalContext);
  if (!context) {
    throw new Error('useLeadModal must be used within a LeadModalProvider');
  }
  return context;
}

interface LeadModalProviderProps {
  children: ReactNode;
}

export function LeadModalProvider({ children }: LeadModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ctaTitle, setCtaTitle] = useState('Organizar meus dados');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const openLeadModal = (title?: string) => {
    if (title) {
      setCtaTitle(title);
    } else {
      setCtaTitle('Organizar meus dados');
    }
    setFormSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setIsOpen(true);
  };

  const closeLeadModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    setLoading(true);
    const originPath = window.location.pathname;
    let pageName = "Desconhecida";
    if (originPath === "/") pageName = "Home";
    else if (originPath.includes("/solucoes/booska")) pageName = "Booska";
    else if (originPath.includes("/solucoes/boom-predict")) pageName = "Boom Predict";
    else if (originPath.includes("/solucoes/")) pageName = "Produto";
    else if (originPath.includes("/blog")) pageName = "Blog";
    else if (originPath.includes("/quem-somos")) pageName = "Quem Somos";

    const leadPayload = {
      name,
      email,
      message,
      cta: `[${pageName}] ${ctaTitle}`,
    };

    try {
      // 1. Submit to the real Express backend persistent CRM
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadPayload),
      });

      if (!response.ok) {
        throw new Error('Server error when storing lead');
      }
    } catch (err) {
      console.warn('Could not store lead on server, falling back to local storage only:', err);
    } finally {
      // 2. Always backup to localStorage as well for additional client resilience
      try {
        const currentLeads = JSON.parse(localStorage.getItem('boo_leads') || '[]');
        currentLeads.unshift({
          id: Math.random().toString(36).substring(2, 9),
          ...leadPayload,
          timestamp: new Date().toISOString(),
          status: 'Novo'
        });
        localStorage.setItem('boo_leads', JSON.stringify(currentLeads));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      
      setLoading(false);
      setFormSubmitted(true);
    }
  };

  return (
    <LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
      {children}
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLeadModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-[500px] bg-white rounded-[24px] overflow-hidden shadow-[0_24px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-100 p-6 md:p-8 select-text text-left"
            >
              {/* Close Button */}
              <button 
                onClick={closeLeadModal}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border-none cursor-pointer"
              >
                <X size={16} />
              </button>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.div
                    key="lead-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="mb-6 pr-8">
                      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
                        {ctaTitle}
                      </h2>
                      <p className="text-sm text-slate-500 font-light mt-1.5 leading-relaxed">
                        Conte pra gente o que você precisa. Vamos conversar!
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Nome
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome"
                          className="w-full px-4 py-3 bg-slate-52 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#46AAFF]/50 focus:border-[#46AAFF] transition-all text-sm font-light"
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="w-full px-4 py-3 bg-slate-52 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#46AAFF]/50 focus:border-[#46AAFF] transition-all text-sm font-light"
                        />
                      </div>

                      {/* Message input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Mensagem
                        </label>
                        <textarea
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Como podemos ajudar?"
                          className="w-full px-4 py-3 bg-slate-52 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#46AAFF]/50 focus:border-[#46AAFF] transition-all text-sm font-light resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#46AAFF] hover:bg-[#3ba2f5] disabled:bg-slate-300 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-[#46AAFF]/20 cursor-pointer text-center relative flex items-center justify-center border-none"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </span>
                        ) : (
                          "Enviar mensagem"
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="lead-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-10 text-center flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center animate-bounce mb-2">
                      <Check size={28} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
                        Mensagem enviada!
                      </h3>
                      <p className="text-sm text-slate-500 font-light max-w-[320px] mx-auto leading-relaxed">
                        Muito obrigado pelo interesse. Nossa equipe comercial entrará em contato em breve para conversar sobre {" "}
                        <span className="font-semibold text-slate-800">"{ctaTitle}"</span>.
                      </p>
                    </div>
                    
                    <button
                      onClick={closeLeadModal}
                      className="mt-6 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs uppercase tracking-wider font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
                    >
                      Entendido
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </LeadModalContext.Provider>
  );
}
