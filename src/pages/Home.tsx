import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView, animate, useMotionValue } from 'motion/react';
import { DotLottiePlayer } from '@dotlottie/react-player';

const ScrollProgressLoading = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: "some" });
  const progress = useMotionValue(0);

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    if (isInView) {
      const controls = animate(progress, 1, {
        duration: 5,
        ease: "easeInOut"
      });
      return () => controls.stop();
    }
  }, [isInView, progress]);

  const smoothProgress = progress;

  const stages = [
    { label: "Ruído", threshold: 0.1, blur: 15 },
    { label: "Complexidade", threshold: 0.3, blur: 8 },
    { label: "Dados", threshold: 0.5, blur: 0 },
    { label: "Clareza", threshold: 0.7, blur: 0 },
    { label: "Decisão", threshold: 0.9, blur: 0 }
  ];

  // Circle animation
  const pathLength = useTransform(smoothProgress, [0, 0.7], [0, 1], { clamp: true });
  const rotate = useTransform(smoothProgress, [0, 0.7], [-90, 0], { clamp: true });
  
  // Icon and Background
  const iconOpacity = useTransform(smoothProgress, [0, 0.5, 0.7], [0, 0.3, 1]);
  const iconBlur = useTransform(smoothProgress, [0.1, 0.5, 0.7], ["blur(12px)", "blur(4px)", "blur(0px)"]);
  const circleBgOpacity = useTransform(smoothProgress, [0.65, 0.7], [0, 1]);
  
  // Scale animation
  const bgScale = useTransform(smoothProgress, [0.65, 0.7, 0.85, 0.9, 0.95, 1], [0.5, 0.64, 0.64, 0.75, 0.68, 0.68]);
  const iconScale = useTransform(smoothProgress, [0.6, 0.7, 0.85, 0.9, 0.95, 1], [0.8, 0.9, 0.9, 1.3, 1.1, 1.1]);

  return (
    <motion.div 
      ref={containerRef} 
      style={{ y: parallaxY }}
      className="w-full max-w-[400px] bg-white rounded-[40px] p-10 md:p-14 border border-gray-100 shadow-[0_32px_64px_-16px_rgba(70,170,255,0.08)] flex flex-col items-center"
    >
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-6">
        {/* SVG Progress Arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="rgba(70,170,255,0.05)"
            strokeWidth="1"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="#46AAFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              pathLength: pathLength,
              rotate: rotate,
              opacity: useTransform(smoothProgress, [0.69, 0.7], [1, 0])
            }}
          />
        </svg>

        {/* Solid Circle fill */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#46AAFF] shadow-2xl shadow-blue-500/10"
          style={{ 
            opacity: circleBgOpacity,
            scale: bgScale
          }}
        />

        {/* boo Icon */}
        <motion.div 
          className="relative z-10 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center"
          style={{ 
            opacity: iconOpacity,
            filter: iconBlur,
            scale: iconScale
          }}
        >
          <motion.img 
            src="/boo.svg" 
            alt="boo" 
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>

      {/* Dynamic Labels */}
      <div className="relative h-8 w-full flex items-center justify-center">
        {stages.map((stage, idx) => {
          return (
            <StageLabel 
              key={stage.label}
              stage={stage}
              idx={idx}
              progress={smoothProgress}
              isLast={idx === stages.length - 1}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

interface StageLabelProps {
  stage: any;
  idx: number;
  progress: any;
  isLast: boolean;
}

const StageLabel: React.FC<StageLabelProps> = ({ stage, idx, progress, isLast }) => {
  const range = [
    Math.max(0, stage.threshold - 0.1),
    stage.threshold,
    Math.min(1, stage.threshold + 0.1)
  ];
  
  const opacity = useTransform(progress, range, isLast ? [0, 1, 1] : [0, 1, 0]);
  const y = useTransform(progress, range, isLast ? [10, 0, 0] : [10, 0, -10]);

  return (
    <motion.div
      className="absolute text-center"
      style={{
        opacity,
        y,
        filter: idx === 0 ? "blur(3px)" : idx === 1 ? "blur(1.2px)" : "none"
      }}
    >
      <span 
        className="text-xl md:text-3xl font-normal tracking-tight"
        style={{
          color: idx === 3 ? "#46AAFF" : (idx === 4 ? "#1a1b1e" : "#9ca3af")
        }}
      >
        {stage.label}
      </span>
    </motion.div>
  );
};
import { 
  ChevronRight, ChevronDown, Check, Zap, Cpu, Search, Eye, BarChart, TrendingUp, 
  Users, Target, Activity, ShieldCheck, Mail, Database, Bot, 
  ArrowRight, ArrowLeft, ShoppingBag, Factory, Coins, Stethoscope, 
  Utensils, Building2, Filter, Sparkles, Layers, Sliders, Play, Compass,
  Split, Menu, Focus, CloudFog, Contrast
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeadModal } from '../context/LeadModalContext';

const Home = () => {
  const { openLeadModal } = useLeadModal();
  const products = [
    {
      id: 'boobot',
      role: 'CRAWLERS',
      name: 'boobot',
      desc: 'Coleta automatizada de dados.',
      iconImg: '/boobot.png',
      color: '#6B7280'
    },
    {
      id: 'booska',
      role: 'CONCORRÊNCIA',
      name: 'booska',
      desc: 'Comparação de concorrência em tempo real.',
      iconImg: '/booska.png',
      color: '#0EA5E9'
    },
    {
      id: 'spyboo',
      role: 'COMPETITIVIDADE',
      name: 'spyboo',
      desc: 'Monitoramento competitivo contínuo.',
      iconImg: '/spyboo.png',
      color: '#22C55E'
    },
    {
      id: 'boompredict',
      role: 'TENDÊNCIAS',
      name: 'boopredict',
      desc: 'Tendências e previsão de mercado.',
      iconImg: '/boom-predict.png',
      color: '#F97316'
    },
    {
      id: 'dashboo',
      role: 'BI',
      name: 'dashboo',
      desc: 'Camada de leitura e visualização.',
      iconImg: '/dashboo.png',
      color: '#A855F7'
    }
  ];

  const sectors = [
    { icon: ShoppingBag, name: 'Varejo & E-commerce', desc: 'pricing, estoque, promoções' },
    { icon: Factory, name: 'Indústria', desc: 'supply chain, concorrência' },
    { icon: Coins, name: 'Mercado Financeiro', desc: 'indicadores, tendências' },
    { icon: Stethoscope, name: 'Saúde & Farma', desc: 'regulatório, preços' },
    { icon: Utensils, name: 'Food & Beverage', desc: 'delivery, posicionamento' },
    { icon: Building2, name: 'Serviços & SaaS', desc: 'benchmark, NPS público' }
  ];

  const sources = [
    { name: 'Mercado Livre', highlight: true },
    { name: 'Amazon BR', highlight: true },
    { name: 'Magazine Luiza', highlight: true },
    { name: 'Americanas' },
    { name: 'Shopee' },
    { name: 'Google Shopping', highlight: true },
    { name: 'Casas Bahia' },
    { name: 'Carrefour' },
    { name: 'Rappi' },
    { name: 'LinkedIn Jobs' },
    { name: 'G2 Reviews', highlight: true },
    { name: 'Reclame Aqui' },
    { name: 'Procon' },
    { name: 'Diário Oficial', highlight: true },
    { name: 'B3' },
    { name: 'IBGE' },
    { name: 'Banco Central', highlight: true },
    { name: 'Receita Federal' },
    { name: '+30 fontes' }
  ];

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const viradaRef = useRef<HTMLDivElement>(null);
  const comoFuncionaRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: viradaScroll } = useScroll({
    target: viradaRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: comoFuncionaScroll } = useScroll({
    target: comoFuncionaRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: insightScroll } = useScroll({
    target: insightRef,
    offset: ["start end", "end start"]
  });

  const circleBooTranslateY = useTransform(insightScroll, [0.4, 0.8], [420, 80]);
  const circleBooY = useSpring(circleBooTranslateY, { stiffness: 60, damping: 25 });

  const parallax1 = useTransform(comoFuncionaScroll, [0, 1], [20, -20]);
  const parallax2 = useTransform(comoFuncionaScroll, [0, 1], [40, -40]);
  const parallax3 = useTransform(comoFuncionaScroll, [0, 1], [60, -60]);

  const viradaProgress = useSpring(viradaScroll, { stiffness: 100, damping: 30 });

  // Define transforms at top level to avoid rule of hooks violation - unrolled for strict compliance
  const t0 = {
    opacity: useTransform(viradaProgress, [0, 0.15], [1, 1]),
    y: useTransform(viradaProgress, [0, 0.15], [0, 0]),
    numberOpacity: useTransform(viradaProgress, [0.05, 0.2], [0.05, 0.3])
  };
  const t1 = {
    opacity: useTransform(viradaProgress, [0.05, 0.45], [0, 1]),
    y: useTransform(viradaProgress, [0.05, 0.45], [30, 0]),
    numberOpacity: useTransform(viradaProgress, [0.1, 0.45], [0.05, 0.3])
  };
  const t2 = {
    opacity: useTransform(viradaProgress, [0.45, 0.9], [0, 1]),
    y: useTransform(viradaProgress, [0.45, 0.9], [30, 0]),
    numberOpacity: useTransform(viradaProgress, [0.5, 0.9], [0.05, 0.3])
  };
  const cardTransforms = [t0, t1, t2];

  const progressWidth = useTransform(viradaProgress, [0, 0.9], ["0%", "100%"]);
  const progressLeft = useTransform(viradaProgress, [0, 0.9], ["0%", "100%"]);
  const progressOpacity = useTransform(viradaProgress, [0, 0.05], [0, 1]);
  
  const c0 = useTransform(viradaProgress, [0, 0.25], ["#46AAFF", "#9ca3af"]);
  const c1 = useTransform(viradaProgress, [0.15, 0.45, 0.75], ["#9ca3af", "#46AAFF", "#9ca3af"]);
  const c2 = useTransform(viradaProgress, [0.6, 0.9], ["#9ca3af", "#46AAFF"]);
  const labelColors = [c0, c1, c2];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollLeft = element.scrollLeft;
    const maxScroll = element.scrollWidth - element.clientWidth;
    setScrollProgress(scrollLeft / maxScroll);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -carouselRef.current.offsetWidth : carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: offset * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col bg-[#f3f4f9]">
      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-[5vw] pt-32 pb-20 overflow-hidden bg-[linear-gradient(to_bottom,#9FD3FF,#46AAFF)]">
        <div className="absolute inset-0 z-0 text-white">
          <img 
            src="/Hero-BG.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover blur-md scale-105"
          />
        </div>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] pointer-events-none opacity-20 bg-blue-400/20 blur-[100px] rounded-full z-10"></div>
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(31,41,55,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.2)_1px,transparent_1px)] bg-[length:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)] z-10"></div>

        <div className="hidden md:block absolute right-[-2%] lg:right-[2%] top-1/2 -translate-y-1/2 w-full max-w-[350px] aspect-square pointer-events-none z-10 opacity-40">
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="w-full h-full flex items-center justify-center overflow-visible"
          >
            <DotLottiePlayer
              src="/hero-animation.lottie"
              autoplay
              loop
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="relative z-20 mb-4 bg-white/15 px-4 py-1.5 rounded-full border border-white/20 text-xs text-white font-medium tracking-wide flex items-center gap-2 backdrop-blur-sm self-center"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse border border-white" />
          +100MM dados processados diariamente
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-20 text-5xl md:text-[68px] font-normal leading-[1.1] tracking-tighter max-w-[900px] mb-6 text-white"
        >
          Dados não <br />
          deveriam gerar dúvida. <br />
          <span className="text-[#21659F] text-5xl md:text-[68px] font-normal">Deveriam gerar direção.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-20 text-base md:text-[16px] text-white/80 max-w-[480px] leading-relaxed mb-8 font-light"
        >
          Deep tech brasileira especializada em coleta, organização e análise de grandes volumes de dados para suporte estratégico de empresas.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-20 flex flex-wrap items-center justify-center gap-4"
        >
          <button 
            onClick={() => openLeadModal('Quero clareza nos meus dados')}
            className="bg-[#21659F] text-white border-none py-3.5 px-8 rounded-xl text-sm font-normal hover:opacity-90 transition-all shadow-lg shadow-[#21659F]/20 active:scale-95 cursor-pointer"
          >
            Quero clareza nos meus dados
          </button>
          <a href="#como-funciona" className="bg-white/10 text-white border border-white/20 py-3.5 px-8 rounded-xl text-sm font-normal hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm">Ver como funciona</a>
        </motion.div>
      </section>

      {/* NUMBERS */}
      <section id="numbers" className="bg-white border-y border-gray-100 py-12 px-[5vw]">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-10 text-center md:text-left">
            <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-2 block">Indicadores</span>
            <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter leading-tight">
              Quando existe clareza, <br />
              os números respondem.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="py-6 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 md:pr-4">
              <div className="text-[46px] font-normal text-[#46AAFF] tracking-tight mb-2">+100<span className="text-[#46AAFF] text-[32px] font-normal">MM</span></div>
              <div className="text-sm md:text-sm text-gray-500 leading-snug font-light">dados processados diariamente</div>
            </div>
            <div className="py-6 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 md:px-4 flex flex-col justify-end">
              <div className="text-[24px] text-gray-500 leading-snug font-light md:mt-1">
                <span className="text-[#46AAFF] font-normal">Monitoramento</span> contínuo de mercado
              </div>
            </div>
            <div className="py-6 last:border-0 md:px-4 flex flex-col justify-end">
              <div className="text-[24px] text-gray-500 leading-snug font-light md:mt-1">
                <span className="text-[#46AAFF] font-normal">Infraestrutura</span> própria de coleta e inteligência
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" className="py-16 md:py-24 px-[5vw] bg-[#f3f4f9]">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-6 block">O problema</span>
          <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter leading-[1.1] mb-0">Mais dados não <br /> resolveram nada.</h2>
          
          <div className="my-8 max-w-[1100px] overflow-hidden">
            <img src="/data.png" alt="Data visualization" loading="lazy" className="w-full h-auto opacity-90" />
          </div>

          <p className="text-[15px] md:text-lg text-gray-500 max-w-[800px] leading-relaxed font-light">
            Informações cresceram. Ferramentas evoluíram. Mas decisões continuam difíceis. <br />
            Empresas continuam acumulando dados e chamando isso de estratégia.
          </p>
        </div>
      </section>

      {/* INSIGHT */}
      <section id="insight" ref={insightRef} className="py-20 md:py-40 px-[5vw] flex flex-col items-center justify-center text-center relative overflow-hidden bg-white">
        <div className="relative w-full max-w-[1100px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <p className="text-[24px] md:text-[48px] font-normal text-gray-900 tracking-tighter leading-[1.1] max-w-[1100px] mx-auto">
              O problema nunca foi <span className="text-[#303030]">o dado.</span> <br />
              <span className="text-[#46AAFF] text-[36px]">Foi a dificuldade de transformar volume em entendimento.</span>
            </p>
          </motion.div>
          
          {/* Glass Circle Boo - Improved Glassmorphism with Refraction/Distortion Effects */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-visible">
            <motion.div 
              style={{ y: circleBooY }}
              className="w-[280px] md:w-[500px] h-[280px] md:h-[500px] rounded-full backdrop-blur-[6px] saturate-[140%] bg-[#F0F0F0]/25 border border-white/50 shadow-[inset_0_4px_6.1px_rgba(255,255,255,0.23),1px_10px_10px_rgba(0,0,0,0.03),2px_23px_14px_rgba(0,0,0,0.02),0_3px_6px_rgba(0,0,0,0.03)] flex items-center justify-center relative overflow-visible"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              {/* Subtle Grain/Noise texture for realistic glass finish */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-10"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
              />

              {/* Lens Specular Highlight - Faking refraction depth */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none z-10" />
              
              {/* Highlight from -45° light source based on Figma Light settings */}
              <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-white/10 blur-[30px] rounded-full pointer-events-none z-10" />
              
              {/* Extra specular highlight on the edge for refraction look */}
              <div className="absolute top-[5%] left-[10%] w-[30%] h-[15%] bg-white/25 blur-[10px] rounded-full rotate-[-45deg] pointer-events-none z-20" />
              
              {/* Outer rim for crispness */}
              <div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none z-30" />

              {/* Character inside the glass - Sharp and clean with a subtle lifted shadow */}
              <img 
                src="/circle-boo.svg" 
                alt="" 
                loading="lazy"
                className="w-[150%] h-[150%] object-contain relative z-20 opacity-100 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MERCADO */}
      <section id="mercado" className="py-16 md:py-24 px-[5vw] bg-[#f3f4f9]">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-6 block">O mercado</span>
          <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter leading-[1.1] mb-4 max-w-[600px]">O mercado coleta dados.</h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light mb-8 max-w-[650px]">
            Poucos conseguem transformar isso em inteligência útil.
          </p>

          <div className="mt-10">
            <h3 className="text-sm font-normal uppercase tracking-wider text-gray-400 mb-6">A maioria das plataformas entrega:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                "excesso de métricas",
                "informações sem prioridade",
                "interfaces complexas",
                "dados difíceis de interpretar"
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 flex items-start gap-4 shadow-sm">
                  <span className="text-red-400 font-bold">•</span>
                  <span className="text-sm text-gray-600 font-light">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center md:text-left py-4">
              <p className="text-lg md:text-xl text-gray-900 font-normal tracking-tight">
                Ter acesso ao dado <span className="text-red-500 font-normal">nunca foi suficiente.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIRADA */}
      <section id="virada" ref={viradaRef} className={`bg-white ${isMobile ? 'py-20' : 'relative min-h-[250vh]'}`}>
        <div className={`${isMobile ? 'relative px-[5vw]' : 'sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-[5vw]'}`}>
          <div className="max-w-[1100px] w-full mx-auto pt-4 md:pt-6">
            <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-4 md:mb-5 block">A virada</span>
            <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter mb-8 md:mb-12 max-w-[800px]">A boo estrutura grandes volumes de dados para transformar informação em inteligência acionável.</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  n: '01', 
                  t: 'Organiza', 
                  bullets: [
                    { text: 'Os dados certos aparecem na ordem certa.', icon: Layers },
                    { text: 'Sem ruído.', icon: Contrast },
                    { text: 'Sem excesso.', icon: Sparkles },
                    { text: 'Só o que importa.', icon: Focus }
                  ] 
                },
                { 
                  n: '02', 
                  t: 'Prioriza', 
                  bullets: [
                    { text: 'O que é urgente vem primeiro.', icon: Zap },
                    { text: 'Hierarquia não é estética.', icon: Menu },
                    { text: 'É instrução.', icon: Compass }
                  ] 
                },
                { 
                  n: '03', 
                  t: 'Direciona', 
                  bullets: [
                    { text: 'Cada informação aponta para uma ação.', icon: Split },
                    { text: 'Dados sem contexto não geram valor.', icon: TrendingUp }
                  ] 
                }
              ].map((card, i) => {
                return (
                  <motion.div 
                    key={i} 
                    style={isMobile ? {} : { opacity: cardTransforms[i].opacity, y: cardTransforms[i].y }}
                    initial={isMobile ? { opacity: 0, y: 20 } : false}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : false}
                    viewport={isMobile ? { once: true } : undefined}
                    transition={isMobile ? { delay: i * 0.1 } : undefined}
                    className="bg-slate-50/70 border border-slate-100/80 px-[26px] pt-[26px] pb-[26px] md:px-[28px] md:pt-[28px] md:pb-[28px] rounded-[24px] relative overflow-hidden min-h-[300px] md:min-h-[315px] flex flex-col transition-all duration-500 hover:border-blue-200 hover:bg-white hover:shadow-[0_24px_48px_rgba(70,170,255,0.08)] cursor-default group"
                  >
                    <h3 className="flex items-center gap-2 mb-5">
                      <span className="font-mono text-[10px] md:text-[11px] font-bold text-[#46AAFF] bg-[#46AAFF]/8 px-2 py-0.5 rounded-full select-none">
                        {card.n}
                      </span>
                      <span className="text-[11px] md:text-xs uppercase tracking-[0.15em] font-semibold text-gray-400">
                        {card.t}
                      </span>
                    </h3>
                    
                    <ul className="space-y-3.5 mb-auto z-10">
                      {card.bullets.map((bullet, bulletIdx) => {
                        const BulletIcon = bullet.icon;
                        return (
                          <li key={bulletIdx} className="flex items-start gap-3.5 leading-snug tracking-tight">
                            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-50/60 text-[#46AAFF] shrink-0 mt-0.5 group-hover:bg-[#46AAFF]/10 transition-colors duration-300">
                              <BulletIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                            </div>
                            <span className="text-[16px] md:text-[18px] font-light text-gray-800 leading-relaxed md:leading-snug">{bullet.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Loading Bar Below Cards - Only on Desktop */}
            <div className="w-full max-w-[1100px] mx-auto hidden md:block mt-10">
              <div className="relative h-[3px] w-full bg-gray-100 rounded-full">
                {/* Progress Fill */}
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[#46AAFF] rounded-full shadow-[0_0_15px_rgba(70,170,255,0.3)]"
                  style={{ width: progressWidth }}
                />
                
                {/* boo Logo Indicator */}
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-blue-50 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/10 z-10"
                  style={{ 
                    left: progressLeft,
                    x: "-50%",
                    opacity: progressOpacity
                  }}
                >
                  <img src="/boo.svg" alt="boo" loading="lazy" className="w-6 h-6 object-contain" />
                </motion.div>
              </div>

              <div className="flex justify-between mt-8">
                {['Organiza', 'Prioriza', 'Direciona'].map((label, i) => (
                  <motion.span 
                    key={label}
                    className="text-[10px] tracking-[0.2em] font-bold"
                    style={{ 
                      color: labelColors[i] 
                    }}
                  >
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTO */}
      <section id="produto" className="py-20 md:py-32 px-[5vw] bg-white border-y border-gray-50">
        <div className="max-w-[1100px] mx-auto flex flex-col items-center">
          <div className="max-w-[900px] mx-auto text-center mb-16">
            <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-6 block">Clareza</span>
            <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter leading-[1.1] mb-6">Informação que você entende na primeira olhada.</h2>
            <p className="text-[14px] md:text-lg text-gray-500 leading-relaxed font-light max-w-[650px] mx-auto">
              Sem esforço. Sem excesso. Sem depender de conhecimento técnico. <br />
              <strong className="text-gray-900 font-normal">A boo transforma dados complexos em leitura clara e acionável.</strong>
            </p>
          </div>

          <div className="relative flex flex-col items-center">
            <ScrollProgressLoading />
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" ref={comoFuncionaRef} className="py-16 md:py-24 px-[5vw] bg-[#f3f4f9]">
        <div className="max-w-[1040px] mx-auto">
          <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-6 block">Como funciona</span>
          <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter mb-4">Da coleta à inteligência.</h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light mb-10 max-w-[650px]">Por trás da clareza existe infraestrutura séria.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Coleta',
                desc: 'Crawlers monitoram fontes públicas, e-commerces, portais e APIs em tempo real.',
                image: '/Coleta.png',
                tags: ['boobot', 'tempo real'],
                parallax: parallax1,
                delay: 0
              },
              {
                step: '02',
                title: 'Estruturação',
                desc: 'Modelos organizam, classificam e enriquecem grandes volumes de dados.',
                image: '/Processamento.png',
                tags: ['inteligência artificial', 'dados estruturados'],
                parallax: parallax2,
                delay: 0.2
              },
              {
                step: '03',
                title: 'Inteligência',
                desc: 'As informações certas aparecem na ordem certa. Prontas para apoiar decisões estratégicas.',
                image: '/Decisão.png',
                tags: ['dashboo', 'decisão rápida'],
                parallax: parallax3,
                delay: 0.4
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                style={{ y: card.parallax }}
                className="flex-1 w-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: card.delay, duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="h-full bg-white border border-gray-100 p-5 rounded-[20px] hover:shadow-xl hover:shadow-gray-200/40 transition-all group flex flex-col"
                >
                  <div className="aspect-[1.6/1] bg-[#f4f6fb] rounded-[12px] mb-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      loading="lazy"
                      className="w-[65%] h-[65%] object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="text-[13px] font-normal text-[#D1D1D1] tracking-tight mb-3">{card.step}</div>
                  <h3 className="text-[20px] md:text-[24px] font-normal text-gray-900 mb-2 tracking-tighter leading-tight">{card.title}</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed font-light mb-5">{card.desc}</p>
                  
                  <div className="mt-auto flex flex-wrap gap-2">
                    {card.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 border border-gray-100 rounded-full text-[11px] text-[#B5B5B5] font-light lowercase tracking-tight">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPACIDADES */}
      <section id="capacidades" className="py-16 md:py-24 px-[5vw] bg-[#f3f4f9]">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-6 block">Tecnologia</span>
            <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter leading-[1.1] mb-6">Infraestrutura robusta para transformar volume em leitura estratégica.</h2>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light mb-8">
              IA, engenharia de dados e inteligência de mercado trabalham juntas para transformar grandes volumes de dados em informação útil.
            </p>
            
            <div className="flex flex-col gap-4">
              {[
                { icon: <Database size={16} />, title: 'Engenharia de Dados', desc: 'Pipelines robustos que extraem, limpam e estruturam dados em grande escala.' },
                { icon: <Cpu size={16} />, title: 'Inteligência Artificial', desc: 'Modelos preditivos, análise semântica e detecção de padrões.' },
                { icon: <Target size={16} />, title: 'Consultoria Estratégica', desc: 'Contexto de negócio aplicado aos dados.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-[18px] hover:border-blue-200 transition-all cursor-default shadow-sm shadow-blue-900/5 group">
                  <div className="text-[#46AAFF] p-2.5 bg-[#46AAFF]/8 rounded-lg mt-0.5 group-hover:bg-[#46AAFF]/15 transition-colors duration-300 shrink-0">{item.icon}</div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#46AAFF] bg-[#46AAFF]/8 px-2 py-0.5 rounded-full select-none inline-block mb-1.5">{item.title}</span>
                    <p className="text-[14px] md:text-[15px] font-light text-gray-800 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '+50 fontes', val: 'conectores nativos' },
              { label: '< 15min', val: 'latência média' },
              { label: '98% uptime', val: 'coleta contínua' },
              { label: 'LGPD', val: 'dados públicos' },
              { label: 'API REST', val: 'integração fácil' },
              { label: 'Zero setup', val: 'pronto para usar' }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 p-8 rounded-[18px] text-center group hover:border-blue-100 transition-all">
                <div className="text-[20px] font-medium text-[#46AAFF] mb-1 tracking-widest">{item.label}</div>
                <div className="text-[10px] text-gray-400 tracking-widest group-hover:text-gray-500 transition-colors">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SETORES */}
      <section id="setores" className="py-16 md:py-24 px-[5vw] bg-[#f3f4f9]">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-4 block text-center">Cobertura</span>
          <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter text-center mb-2">Onde a boo coleta.</h2>
          <p className="text-base md:text-lg text-gray-500 text-center font-light mb-10 italic">Monitoramento contínuo do ecossistema competitivo.</p>
          
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <span className="text-[10px] font-normal tracking-widest text-[#46AAFF] mb-4 block">Setores atendidos</span>
              <div className="flex flex-col gap-2">
                {sectors.map((s, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 border border-white rounded-[18px] bg-white hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#46AAFF] transition-colors">
                      <s.icon size={20} />
                    </div>
                    <span className="font-normal text-gray-800 tracking-tight text-sm">{s.name}</span>
                    <span className="text-[10px] text-gray-400 ml-auto font-light uppercase tracking-widest">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-[10px] font-normal tracking-widest text-[#46AAFF] mb-4 block">Fontes principais</span>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => (
                  <span key={i} className={`px-5 py-2 rounded-full text-[11px] font-medium transition-all cursor-default border ${src.highlight ? 'bg-blue-50 text-[#46AAFF] border-blue-200' : (i === 19 ? 'bg-[#f3f4f9] text-gray-400 border-[#e0e0e0]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:bg-gray-50')}`}>
                    {src.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSSISTEMA */}
      <section id="ecossistema" className="py-16 md:py-24 bg-[#f3f4f9] overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-[5vw]">
          <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-6 block">Ecossistema</span>
          <div className="flex items-end justify-between mb-8">
            <div className="max-w-[600px]">
              <h2 className="text-[26px] md:text-[34px] font-normal text-gray-900 tracking-tighter mb-4">Cinco produtos. <br /> Uma promessa.</h2>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light">Da coleta à inteligência. <br /> Cada camada tem uma ferramenta dedicada.</p>
            </div>
            
            <div className="hidden md:flex gap-2">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all active:scale-90">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all active:scale-90">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <div 
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 py-4 pb-12 snap-x snap-mandatory no-scrollbar pl-[5vw] pr-[5vw] md:pl-[calc(max(0px,100vw-1100px)/2+5vw)] md:pr-[calc(max(0px,100vw-1100px)/2+5vw)] scroll-pl-[5vw] md:scroll-pl-[calc(max(0px,100vw-1100px)/2+5vw)]"
            style={{ scrollbarWidth: 'none' }}
          >
            {products.map((p, i) => (
              <div key={i} className="min-w-[85%] md:min-w-[320px] lg:min-w-[350px] snap-start h-full py-4">
                <Link 
                  to={`/produto/${p.id}`} 
                  className="bg-white border border-gray-100 rounded-[18px] p-4 no-underline transition-all hover:shadow-2xl hover:shadow-gray-200/50 group flex flex-col active:scale-[0.98] h-[420px] md:h-[450px]"
                >
                  <div className="h-[170px] w-full relative overflow-hidden rounded-[8px] mb-6 bg-gray-50 flex items-center justify-center">
                    <img src={p.iconImg} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  
                  <div className="px-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h3 className="text-[28px] font-normal text-gray-900 tracking-tight leading-tight">{p.name}</h3>
                      <div className="px-2.5 py-0.5 pointer-events-none rounded-full border border-gray-100 text-[10px] font-normal tracking-widest text-gray-400">
                        {p.role}
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-8">{p.desc}</p>
                    
                    <div className="mt-auto pb-2">
                      <span className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-[10px] font-normal tracking-wider shadow-lg shadow-black/5 group-hover:bg-blue-600 transition-colors inline-block">
                        Saiba mais
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Nav Arrows */}
          <button onClick={() => scroll('left')} className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 bg-white/80 border border-gray-100 w-14 h-14 rounded-full items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-opacity active:scale-90">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <button onClick={() => scroll('right')} className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 bg-white/80 border border-gray-100 w-14 h-14 rounded-full items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-opacity active:scale-90">
            <ArrowRight size={24} className="text-gray-900" />
          </button>

          {/* Progress Bar */}
          <div className="max-w-[1100px] mx-auto px-[5vw]">
            <div className="w-full h-[1px] bg-gray-200 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-600 w-1/3"
                animate={{ x: `${scrollProgress * 200}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAL */}
      <section id="diferencial" className="py-24 md:py-36 px-[5vw] text-center border-t border-gray-100 bg-white">
        <div className="max-w-[900px] mx-auto">
          <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-6 block">Diferencial</span>
          <h2 className="text-[28px] md:text-[40px] font-normal text-gray-900 tracking-tighter leading-tight mb-8">
            Dados só têm valor quando geram leitura clara.
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light max-w-[600px] mx-auto">
            A diferença não está apenas na coleta. <br />
            <strong className="text-[#46AAFF] font-normal">Está na capacidade de transformar volume em inteligência útil.</strong>
          </p>
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="manifesto" className="py-12 md:py-16 px-[5vw] border-y border-gray-200 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-sm font-normal tracking-[0.2em] text-[#46AAFF] mb-4 block">Manifesto</span>
          <div className="max-w-[760px]">
            <div className="flex flex-col gap-2">
              <p className="text-lg text-gray-400 tracking-tight leading-relaxed py-3 border-b border-gray-100 transition-colors cursor-default hover:text-gray-900">
                O mundo está cheio de dados. <strong className="text-gray-900 font-normal">E vazio de clareza.</strong>
              </p>
              <p className="text-lg text-gray-400 tracking-tight leading-relaxed py-3 border-b border-gray-100 transition-colors cursor-default hover:text-gray-900">
                A gente não acredita em mais informação. <strong className="text-gray-900 font-normal">A gente acredita em entendimento.</strong>
              </p>
              <p className="text-lg text-gray-400 tracking-tight leading-relaxed py-3 border-b border-gray-100 transition-colors cursor-default hover:text-gray-900">
                Sem dados, tudo é palpite. <strong className="text-gray-900 font-normal">Sem inteligência, os dados não têm valor.</strong>
              </p>
              <p className="text-lg text-gray-900 tracking-tight leading-relaxed py-3 border-b border-transparent transition-colors cursor-default hover:text-blue-600">
                <strong className="font-normal">Decidir bem é vantagem competitiva.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 md:py-32 px-[5vw] text-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <h2 className="text-[32px] md:text-[34px] font-normal text-gray-900 tracking-tighter leading-[1.05] mb-8">Você não precisa <br /> de mais dados.</h2>
        <p className="text-xl text-gray-400 leading-relaxed font-light mb-10 tracking-tight">Precisa de clareza.</p>
        <button 
          onClick={() => openLeadModal('Quero ver isso funcionando')}
          className="bg-[#46AAFF] text-white font-normal py-4 px-12 rounded-xl text-base shadow-2xl shadow-blue-600/30 hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
        >
          Quero ver isso funcionando
        </button>

      </section>
    </div>
  );
};

export default Home;
