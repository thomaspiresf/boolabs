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
import { useLeadModal } from '../context/LeadModalContext';

export default function QuemSomosPage() {
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
              Transformamos caos em <span className="font-normal text-slate-950">ordem, estrutura e receita</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base md:text-lg font-light text-slate-500 leading-relaxed mb-4"
            >
              Pioneira na aplicação de Inteligência Artificial desde 2014, a boo renasce como Deep Tech para atuar como o motor tecnológico invisível de gigantes do mercado, preparando-se para liderar a América Latina.
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
            <div className="text-4xl md:text-5xl font-light tracking-tight text-[#21659F]">1B+</div>
            <div className="text-sm font-light text-slate-600 mt-2">Dados processados diariamente</div>
          </div>
          <div className="text-center md:px-6 md:border-l md:border-slate-100/80">
            <div className="text-4xl md:text-5xl font-light tracking-tight text-slate-800">12+ Anos</div>
            <div className="text-sm font-light text-slate-600 mt-2">Pesquisa & desenvolvimento</div>
          </div>
          <div className="text-center md:px-6 md:border-l md:border-slate-100/80">
            <div className="text-4xl md:text-5xl font-light tracking-tight text-slate-800">2014</div>
            <div className="text-sm font-light text-slate-600 mt-2">Pioneirismo em IA no Brasil</div>
          </div>
        </motion.div>

        {/* The Institutional story (Renasce como Deep Tech) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 items-stretch">
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight mb-4">
                Pioneirismo, Ciência e Renascimento
              </h2>
              <div className="space-y-4 text-xs md:text-sm font-light text-slate-500 leading-relaxed">
                <p>
                  A boo, nascida em Vinhedo-SP, anuncia seu reposicionamento estratégico de mercado focado na mais pura Deep Tech, combinando uma infraestrutura inabalável com modelos preditivos extremamente robustos.
                </p>
                <p>
                  Fugindo das abordagens tradicionais, desenvolvemos motores de processamento e modelos matemáticos multidisciplinares que cruzam conceitos fascinantes de <span className="font-medium text-slate-700">biologia evolutiva</span> e <span className="font-medium text-slate-700">psicologia comportamental</span>. 
                </p>
                <p>
                  Essa metodologia proprietária permite encontrar padrões ultracomplexos em frações de segundo, entregando insights preditivos de altíssima precisão e inquestionável valor comercial para grandes corporações sem latência ou fricção operacional.
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
                "Não somos apenas uma camada de software; somos uma Deep Tech que constrói as fundações matemáticas para que grandes players possam operar no limite da performance"
              </p>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-semibold text-slate-800">Zé Lima</h4>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">Executivo da boo</p>
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
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#21659F] block mb-3 font-mono">Missão</span>
              <p className="text-sm font-light text-slate-500 leading-relaxed">
                Extrair, organizar e estruturar dados em grande escala para gerar informação confiável que suporte decisões inteligentes e seguras.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F] mb-5">
                <Compass size={20} />
              </div>
              <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#21659F] block mb-3 font-mono">Visão</span>
              <p className="text-sm font-light text-slate-500 leading-relaxed">
                Ser a principal referência em dados no Brasil, criando soluções que unem tecnologia de ponta, criatividade sem amarras e propósito humano genuíno.
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
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#46AAFF] font-mono">Nosso Manifesto</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-base md:text-xl text-slate-400 tracking-tight leading-relaxed py-4 border-b border-slate-800/60 transition-colors cursor-default hover:text-white">
                O mundo está cheio de dados. <strong className="text-white font-normal">E vazio de clareza.</strong>
              </p>
              <p className="text-base md:text-xl text-slate-400 tracking-tight leading-relaxed py-4 border-b border-slate-800/60 transition-colors cursor-default hover:text-white">
                A gente não acredita em mais informação. <strong className="text-white font-normal">A gente acredita em entendimento.</strong>
              </p>
              <p className="text-base md:text-xl text-slate-400 tracking-tight leading-relaxed py-4 border-b border-slate-800/60 transition-colors cursor-default hover:text-white">
                Sem dados, tudo é palpite. <strong className="text-white font-normal">Sem inteligência, os dados não têm valor.</strong>
              </p>
              <p className="text-base md:text-xl text-[#46AAFF] tracking-tight leading-relaxed py-4 border-b border-transparent transition-colors cursor-default hover:text-blue-300">
                <strong className="font-normal text-white md:text-xl">Decidir bem é vantagem competitiva.</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Board */}
        <div className="space-y-10 mb-20">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#21659F]">Cultura Viva</span>
            <h2 className="text-2xl font-light text-slate-900 tracking-tight mt-1">Os nossos valores intangíveis</h2>
            <p className="text-xs font-light text-slate-400 mt-1">Mais do que palavras na parede, é o filtro pelo qual construímos nossa equipe e nosso motor analítico.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Value 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                <Zap size={16} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Gente louca muda o mundo</h3>
                <p className="text-[11px] font-light text-slate-450 mt-1">Os normais estão ocupados... repetindo padrões.</p>
              </div>
            </motion.div>

            {/* Value 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                <Eye size={16} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Visão além do óbvio</h3>
                <p className="text-[11px] font-light text-slate-450 mt-1">Vemos o que ninguém vê. Às vezes é genial, às vezes são devaneios.</p>
              </div>
            </motion.div>

            {/* Value 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                <Flame size={16} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Coragem criativa</h3>
                <p className="text-[11px] font-light text-slate-450 mt-1">Se der medo, é sinal que estamos no caminho certo.</p>
              </div>
            </motion.div>

            {/* Value 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                <Heart size={16} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Viver o lado do cliente</h3>
                <p className="text-[11px] font-light text-slate-450 mt-1">Because compreender de verdade a dor do seu negócio é nossa prioridade absoluta.</p>
              </div>
            </motion.div>

            {/* Value 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Empatia</h3>
                <p className="text-[11px] font-light text-slate-450 mt-1">Entender o ser humano por trás de cada tela e de cada bug relatado.</p>
              </div>
            </motion.div>

            {/* Value 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                <Sun size={16} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Clareza</h3>
                <p className="text-[11px] font-light text-slate-450 mt-1">Se está confuso ou prolixo, é porque alguém tentou ser profundo demais.</p>
              </div>
            </motion.div>

            {/* Value 7 (takes full width or is centered in the layout) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow shadow-[0_2px_12px_rgba(0,0,0,0.015)] sm:col-span-2 md:col-span-1"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#21659F]">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Mão na massa</h3>
                <p className="text-[11px] font-light text-slate-450 mt-1">Menos reuniões desnecessárias, mais "deixa comigo que eu resolvo".</p>
              </div>
            </motion.div>
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
              Construa o futuro dos seus dados conosco
            </h3>
            <p className="text-xs md:text-sm font-light text-slate-400 leading-relaxed mb-8">
              Conte com uma equipe pioneira em inteligência de dados de alta volumetria e acelere a inteligência preditiva nas tomadas de decisão da sua empresa.
            </p>
            <button
              onClick={() => openLeadModal('Quem Somos CTA')}
              className="bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs tracking-wide px-7 py-3.5 rounded-xl cursor-pointer transition-all active:scale-97 flex items-center gap-2 border-none shadow-md"
              id="cta-about-modal-trigger"
            >
              Definir estratégia de dados <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
