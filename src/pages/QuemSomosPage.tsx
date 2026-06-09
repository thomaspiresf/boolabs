import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Database, 
  ArrowRight, 
  Layers, 
  Users, 
  TrendingUp, 
  Zap, 
  Eye, 
  Flame, 
  Heart, 
  Sun, 
  Cpu, 
  Globe, 
  Clock, 
  MessageSquare,
  Award,
  Sparkles,
  Target,
  Compass
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLeadModal } from '../context/LeadModalContext';

export default function QuemSomosPage() {
  const { t } = useTranslation();
  const { openLeadModal } = useLeadModal();

  return (
    <div className="min-h-screen bg-[#fafafc] pt-32 pb-24 px-[5vw] selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center mb-16">
          <div className="md:col-span-7 text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-tight mb-6"
            >
              {t('about.hero.title1')} <span className="font-normal text-slate-950">{t('about.hero.title2')}</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base md:text-lg font-light text-slate-500 leading-relaxed mb-4"
            >
              {t('about.hero.desc')}
            </motion.p>
          </div>

          {/* Right Image/3D Render Section (User preferred mascot image without bottom white bar) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-5 flex justify-center w-full"
          >
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(30,141,255,0.22)] select-none group border border-slate-200/50" 
              id="quem-somos-hero-image"
            >
              <img 
                src="/Hero img.png" 
                alt="boo - Inteligência de Dados" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white border border-slate-100 rounded-3xl p-8 md:p-10 mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.015)]"
        >
          <div className="text-center md:px-6">
            <div className="text-4xl md:text-5xl font-light tracking-tight text-[#21659F]">{(t('about.stats', { returnObjects: true }) as any)[0].val}</div>
            <div className="text-sm font-light text-slate-600 mt-2">{(t('about.stats', { returnObjects: true }) as any)[0].desc}</div>
          </div>
          <div className="text-center md:px-6 md:border-l md:border-slate-100/80">
            <div className="text-4xl md:text-5xl font-light tracking-tight text-slate-800">{(t('about.stats', { returnObjects: true }) as any)[1].val}</div>
            <div className="text-sm font-light text-slate-600 mt-2">{(t('about.stats', { returnObjects: true }) as any)[1].desc}</div>
          </div>
          <div className="text-center md:px-6 md:border-l md:border-slate-100/80">
            <div className="text-4xl md:text-5xl font-light tracking-tight text-slate-800">{(t('about.stats', { returnObjects: true }) as any)[2].val}</div>
            <div className="text-sm font-light text-slate-600 mt-2">{(t('about.stats', { returnObjects: true }) as any)[2].desc}</div>
          </div>
        </motion.div>

        {/* The Institutional story (Renasce como Deep Tech) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 items-stretch">
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight mb-4">
                {t('about.story.title')}
              </h2>
              <div className="space-y-4 text-xs md:text-sm font-light text-slate-500 leading-relaxed">
                <p>
                  {t('about.story.p1')}
                </p>
                <p>
                  {t('about.story.p2')} <span className="font-medium text-slate-700">{t('about.story.p2_highlight1')}</span> {t('about.story.p2_and')} <span className="font-medium text-slate-700">{t('about.story.p2_highlight2')}</span> 
                </p>
                <p>
                  {t('about.story.p3')}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex md:h-[323px]">
            {/* Zé Lima Quote card */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_6px_36px_rgba(0,0,0,0.02)] relative overflow-hidden w-full md:h-[323px]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="text-3xl text-blue-200 font-serif leading-none mt-1">“</div>
              <p className="text-[16px] font-light text-slate-600 leading-relaxed italic mb-6">
                {t('about.quote.text')}
              </p>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-semibold text-slate-800">{t('about.quote.name')}</h4>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">{t('about.quote.role')}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mission & Vision cards – Spans full width across this content area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          <div className="bg-white p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F] mb-5">
                <Target size={20} />
              </div>
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#21659F] block mb-3 font-mono">{t('about.mission.label')}</span>
              <p className="text-sm font-light text-slate-500 leading-relaxed">
                {t('about.mission.text')}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F] mb-5">
                <Compass size={20} />
              </div>
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#21659F] block mb-3 font-mono">{t('about.vision.label')}</span>
              <p className="text-sm font-light text-slate-500 leading-relaxed">
                {t('about.vision.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Manifesto Boo (Large Poster layout) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-20 shadow-xl"
          id="manifesto-boo-block"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#46AAFF]/5 rounded-full blur-[90px] pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#46AAFF] font-mono">{t('home.manifesto.label')}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-base md:text-xl text-slate-400 tracking-tight leading-relaxed py-4 border-b border-slate-800/60 transition-colors cursor-default hover:text-white">
                {t('home.manifesto.line1a')} <strong className="text-white font-normal">{t('home.manifesto.line1b')}</strong>
              </p>
              <p className="text-base md:text-xl text-slate-400 tracking-tight leading-relaxed py-4 border-b border-slate-800/60 transition-colors cursor-default hover:text-white">
                {t('home.manifesto.line2a')} <strong className="text-white font-normal">{t('home.manifesto.line2b')}</strong>
              </p>
              <p className="text-base md:text-xl text-slate-400 tracking-tight leading-relaxed py-4 border-b border-slate-800/60 transition-colors cursor-default hover:text-white">
                {t('home.manifesto.line3a')} <strong className="text-white font-normal">{t('home.manifesto.line3b')}</strong>
              </p>
              <p className="text-base md:text-xl text-[#46AAFF] tracking-tight leading-relaxed py-4 border-b border-transparent transition-colors cursor-default hover:text-blue-300">
                <strong className="font-normal text-white md:text-xl">{t('home.manifesto.line4')}</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Board */}
        <div className="space-y-10 mb-20">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#21659F]">{t('about.values.label')}</span>
            <h2 className="text-2xl font-light text-slate-900 tracking-tight mt-1">{t('about.values.title')}</h2>
            <p className="text-xs font-light text-slate-400 mt-1">{t('about.values.desc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icon: Zap, key: 0 },
              { icon: Eye, key: 1 },
              { icon: Flame, key: 2 },
              { icon: Heart, key: 3 },
              { icon: Users, key: 4 },
              { icon: Sun, key: 5 },
              { icon: Cpu, key: 6 }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={i % 3 !== 0 ? { delay: (i % 3) * 0.05 } : {}}
                  className={`bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)] ${i === 6 ? 'sm:col-span-2 md:col-span-1' : ''}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-800">{(t('about.values.list', { returnObjects: true }) as any)[i].title}</h3>
                    <p className="text-[11px] font-light text-slate-450 mt-1">{(t('about.values.list', { returnObjects: true }) as any)[i].desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Final CTA Board */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-tr from-slate-900 to-slate-950 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
          id="cta-about-us-block"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[70px] pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#46AAFF]/5 rounded-full blur-[70px] pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
            <h3 className="text-xl md:text-3xl font-light text-white tracking-tight mb-3">
              {t('about.cta.title')}
            </h3>
            <p className="text-xs md:text-sm font-light text-slate-400 leading-relaxed mb-8">
              {t('about.cta.desc')}
            </p>
            <button
              onClick={() => openLeadModal(t('about.cta.btn'))}
              className="bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wide px-7 py-3.5 rounded-xl cursor-pointer transition-all active:scale-97 flex items-center gap-2 border-none shadow-md"
              id="cta-about-modal-trigger"
            >
              {t('about.cta.btn')} <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
