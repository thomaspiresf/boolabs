import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function SupportPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'O que a boo faz?',
      answer: 'Organizamos, coletamos, analisamos e transformamos dados em inteligência aplicada por meio de 4 camadas (coleta, mercado, inteligência e BI).'
    },
    {
      id: 2,
      question: 'A Boo trabalha com empresas de todos os setores?',
      answer: 'Sim. Se existe dado, a boo funciona.'
    },
    {
      id: 3,
      question: 'Vocês integram com qualquer sistema?',
      answer: 'Sim. A boo integra via API, webhook, conectores e importações diretas.'
    },
    {
      id: 4,
      question: 'Posso contratar apenas uma solução?',
      answer: 'Sim. Cada produto pode ser adquirido individualmente ou em pacotes.'
    },
    {
      id: 5,
      question: 'Vocês criam dashboards personalizados?',
      answer: 'Sim. A boo desenvolve BI sob medida via Dashboo.'
    },
    {
      id: 6,
      question: 'Quanto tempo leva para começar?',
      answer: 'De 5 a 15 dias, dependendo da complexidade da integração.'
    },
    {
      id: 7,
      question: 'Os dados são seguros?',
      answer: '100%. Criptografados, auditados e armazenados em servidores confiáveis.'
    }
  ];

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Acessei a página de suporte da boo e gostaria de falar com um atendente.');
    window.open(`https://wa.me/5541998755557?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fafafc] pt-32 pb-24 px-[5vw]">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="text-left mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl font-normal text-slate-800 tracking-tight"
          >
            Dúvidas frequentes
          </motion.h1>
        </div>

        {/* FAQs Simple list with minimal border styling */}
        <div className="border-t border-slate-200/50 mb-14">
          <AnimatePresence initial={false}>
            {faqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="border-b border-slate-200/55"
                >
                  <button
                    onClick={() => handleToggle(faq.id)}
                    className="w-full py-5.5 flex items-center justify-between text-left gap-4 focus:outline-none cursor-pointer group"
                    id={`faq-btn-${faq.id}`}
                  >
                    <span className="font-normal text-slate-850 text-[15px] md:text-[17px] leading-snug group-hover:text-slate-950 transition-colors">
                      {faq.question}
                    </span>
                    <motion.div 
                      className="text-gray-400 shrink-0"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronDown size={18} className="stroke-[1.5]" />
                    </motion.div>
                  </button>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="pb-6 text-xs md:text-[14px] text-gray-500 font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* WhatsApp Call to Action Block at the end */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-slate-200/50 rounded-2xl p-6 md:p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.015)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-50/50 rounded-full blur-[45px] pointer-events-none -mt-24 opacity-60" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.338 4.982L2 22l5.21-.1.13.07a9.914 9.914 0 0 0 4.67 1.18h.005c5.507 0 9.99-4.478 9.99-9.984 0-2.667-1.04-5.174-2.926-7.062A9.92 9.92 0 0 0 12.012 2zm0 1.64c2.227 0 4.321.868 5.897 2.446a8.312 8.312 0 0 a 8.35 8.35 0 0 1-5.897 8.342h-.004a8.304 8.304 0 0 1-3.957-1.02l-.28-.17-2.94.06.06-2.87-.18-.29a8.307 8.307 0 0 1-1.1-4.062c0-4.6 3.738-8.344 8.317-8.344zm4.84 5.926c-.266-.134-1.572-.776-1.816-.865-.244-.09-.422-.134-.599.134-.177.269-.687.865-.842 1.043-.156.18-.311.202-.577.068-.266-.134-1.123-.414-2.14-1.32-.79-.705-1.325-1.577-1.48-1.846-.155-.27-.017-.415.116-.549.12-.12.266-.314.4-.472.133-.157.177-.27.266-.45.089-.18.044-.337-.022-.472-.066-.135-.6-1.444-.821-1.983-.216-.52-.453-.449-.599-.449a8.38 8.38 0 0 0-.466-.011c-.155 0-.41.056-.621.291-.211.236-.81.792-.81 1.933 0 1.14.83 2.245.942 2.396.11.152 1.633 2.493 3.957 3.5a13.3 13.3 0 0 0 1.32.485c.553.176 1.056.151 1.455.092.444-.066 1.36-.554 1.554-1.09.193-.536.193-.996.134-1.09-.059-.095-.216-.151-.482-.285z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-slate-800 mb-1">WhatsApp</h3>
            <p className="text-xs font-light text-[#777] mb-6 max-w-sm leading-relaxed">
              Atendimento todos os dias da semana, inclusive feriados.
            </p>
            
            <button 
              onClick={handleWhatsAppContact}
              className="bg-[#128C7E] hover:bg-[#075e54] text-white px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wide shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-none"
              id="whatsapp-contact-btn"
            >
              Entrar em contato
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
