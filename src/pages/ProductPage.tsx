import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { ProductSelector } from '../components/ProductSelector';
import { useLeadModal } from '../context/LeadModalContext';

const productData: Record<string, any> = {
  boobot: {
    tag: 'Crawlers & Coleta',
    name: 'boobot',
    headline: 'Seus concorrentes estão mudando.',
    highlight: 'Você está sabendo?',
    sub: 'boobot coleta dados públicos da web em escala, de forma automática, contínua e sem que você precise mover um dedo.',
    color: '#C9C9C9',
    iconImg: '/boobot.png',
    problems: [
      { q: '"Vou checar os preços dos concorrentes essa semana."', a: 'Essa semana virou mês. O mercado não espera.' },
      { q: '"Minha equipe faz isso manualmente."', a: 'Coleta manual é lenta, cara e cheia de erro humano.' },
      { q: '"Preciso de um dev para montar isso."', a: 'Com boobot, não precisa. Está pronto para usar.' }
    ],
    steps: [
      { n: '01. Configure', t: 'Diga o que quer monitorar', d: 'Informe os sites, categorias e campos que importam. Sem código e sem dev.' },
      { n: '02. Ative', t: 'boobot vai à web por você', d: 'Crawlers personalizados entram em campo. Coletam, limpam e estruturam os dados automaticamente.' },
      { n: '03. Receba', t: 'Dados prontos para decidir', d: 'Integre via API ou visualize direto no dashboo. Os dados chegam, você decide o que fazer.' }
    ],
    gains: [
      { t: 'Sem planilhas de monitoramento', d: 'Nada de ctrl+c, ctrl+v de dados do concorrente toda semana.' },
      { t: 'Sem dependência de dev', d: 'boobot não exige time técnico para configurar ou manter.' },
      { t: 'Sem dado desatualizado', d: 'Coleta contínua. Você sempre tem o estado atual do mercado.' },
      { t: 'Sem preocupação com LGPD', d: 'Apenas dados públicos. Coleta ética, segura e documentada.' }
    ],
    nums: [
      { v: '+1bi', l: 'registros coletados por mês' },
      { v: '+50', l: 'fontes monitoradas nativamente' },
      { v: '98%', l: 'uptime na coleta contínua' },
      { v: '<15min', l: 'latência média dos dados' }
    ],
    cta: 'Criar meu crawler'
  },
  booska: {
    tag: 'Análise da Concorrência',
    name: 'booska',
    headline: 'Seu concorrente mudou o preço ontem.',
    highlight: 'Você ficou sabendo hoje?',
    sub: 'booska monitora produtos, preços, campanhas e posicionamento da concorrência, entregando a comparação já interpretada.',
    color: '#2481CE',
    iconImg: '/booska.png',
    problems: [
      { q: '"Preciso entender por que estou perdendo vendas."', a: 'Às vezes seu preço está 12% acima da média. booska mostra exatamente onde.' },
      { q: '"Sigo o que meus concorrentes fazem."', a: 'Seguir quem? Sem dados, você está reagindo no escuro.' },
      { q: '"Faço benchmarking todo trimestre."', a: 'O mercado muda todo dia. Benchmark trimestral é história antiga.' }
    ],
    steps: [
      { n: '01. Mapeie', t: 'Defina seus concorrentes', d: 'Informe quem você quer monitorar por produto, categoria ou mercado. booska faz o resto.' },
      { n: '02. Compare', t: 'Preço, campanha, posição', d: 'Dashboards comparativos em tempo real. Você vê onde está à frente e onde está atrás.' },
      { n: '03. Aja', t: 'A resposta vem com o dado', d: '"Seu preço está 12% acima da média. Aqui está o que você pode fazer." Sem analista no meio.' }
    ],
    gains: [
      { t: 'Sem pesquisa manual de concorrente', d: 'Nada de entrar nos sites dos concorrentes toda semana.' },
      { t: 'Sem surpresa de precificação', d: 'Você sabe quando o concorrente muda o preço — antes de perder a venda.' },
      { t: 'Sem semanas de análise', d: 'O comparativo está pronto. Em minutos, não em semanas de pesquisa.' },
      { t: 'Sem dado sem contexto', d: 'A comparação já vem interpretada. Você decide — não analisa.' }
    ],
    nums: [
      { v: 'Tempo real', l: 'atualização de preços e campanhas' },
      { v: '+200', l: 'marcas monitoradas simultaneamente' },
      { v: '12%', l: 'diferença média que passa despercebida' },
      { v: '0', l: 'analistas necessários para interpretar' }
    ],
    cta: 'Analisar minha concorrência'
  },
  spyboo: {
    tag: 'Inteligência Competitiva',
    name: 'spyboo',
    headline: 'A maioria das empresas descobre o que o concorrente fez',
    highlight: 'quando já é tarde.',
    sub: 'spyboo é o radar que nunca desliga. Monitora o ecossistema competitivo continuamente para que a informação chegue antes da urgência.',
    color: '#00CBA0',
    iconImg: '/spyboo.png',
    problems: [
      { q: '"Soube que o concorrente lançou produto pela mídia."', a: 'Pela mídia, todo mundo já sabe. A vantagem estava nos sinais anteriores ao lançamento.' },
      { q: '"Meu time monitora o mercado."', a: 'Monitoramento humano é pontual. O mercado é contínuo.' },
      { q: '"Quando preciso, faço uma análise."', a: 'Quando você precisa, já perdeu a janela de reação.' }
    ],
    steps: [
      { n: '01. Configure', t: 'Defina seu ecossistema', d: 'Empresas, categorias, palavras-chave e movimentos que importam para o seu setor.' },
      { n: '02. Monitore', t: 'spyboo nunca dorme', d: 'Coleta contínua de sinais: novos produtos, mudanças de posicionamento, variações de preço.' },
      { n: '03. Antecipe', t: 'Alertas antes da urgência', d: 'Notificações inteligentes quando algo relevante acontece. Você age antes que vire problema.' }
    ],
    gains: [
      { t: 'Sem surpresa de mercado', d: 'Os sinais chegam antes do movimento virar notícia.' },
      { t: 'Sem monitoramento manual', d: 'spyboo monitora enquanto seu time foca em decisão, não em pesquisa.' },
      { t: 'Sem análise retroativa', d: 'Você para de olhar para o passado tentando entender o que aconteceu.' },
      { t: 'Sem reação tardia', d: 'Com alertas em tempo real, a janela de ação está sempre aberta.' }
    ],
    nums: [
      { v: '24/7', l: 'monitoramento contínuo' },
      { v: '+100', l: 'sinais de mercado rastreados' },
      { v: '<1h', l: 'tempo médio para o primeiro alerta' },
      { v: '0', l: 'surpresas de mercado sem alerta prévio' }
    ],
    cta: 'Ativar meu radar'
  },
  dashboo: {
    tag: 'Business Intelligence',
    name: 'dashboo',
    headline: 'Se você precisa explicar seu dashboard,',
    highlight: 'ele falhou.',
    sub: 'dashboo é o BI que o gestor lê na primeira olhada ou de forma rápida. Sem necessidade de treinamento, analista ou manual.',
    color: '#8435F2',
    iconImg: '/dashboo.png',
    problems: [
      { q: '"Tenho Power BI mas só o analista sabe usar."', a: 'BI que precisa de treinamento não é BI — é mais um sistema que o time evita.' },
      { q: '"Meu dashboard mostra tudo mas não diz nada."', a: 'Dado sem hierarquia é ruído. O problema nunca foi o dado — foi como ele é mostrado.' },
      { q: '"Demoro horas preparando relatório para a diretoria."', a: 'O relatório já deveria estar pronto — com a decisão embutida.' }
    ],
    steps: [
      { n: '01. Conecte', t: 'Suas fontes em um lugar', d: 'ERP, CRM, planilhas, boobot, APIs. dashboo centraliza tudo sem exigir engenheiro de dados.' },
      { n: '02. Organize', t: 'Hierarquia automática', d: 'O que é urgente aparece primeiro. O que é contexto fica em segundo plano.' },
      { n: '03. Decida', t: 'Cada número aponta uma ação', d: 'dashboo não mostra o que aconteceu. Mostra o que isso significa e o que você deve fazer a seguir.' }
    ],
    gains: [
      { t: 'Sem horas preparando relatório', d: 'dashboo gera o relatório com a decisão já embutida. Você só apresenta.' },
      { t: 'Sem dependência de analista', d: 'O gestor lê direto. Sem intermediário para explicar o número.' },
      { t: 'Sem treinamento de plataforma', d: 'Primeira olhada já funciona. Não tem curva de aprendizado.' },
      { t: 'Sem dashboard que paralisa', d: 'Dados que você não entende viram fantasmas. dashboo espanta os dois.' }
    ],
    nums: [
      { v: '0', l: 'horas de treinamento para usar' },
      { v: '1ª', l: 'olhada já é suficiente' },
      { v: '5x', l: 'mais rápido que um BI tradicional' },
      { v: '100%', l: 'das entregas com uma recomendação' }
    ],
    cta: 'Organizar meus dados'
  },
  boompredict: {
    tag: 'Previsão de Mercado',
    name: 'boom predict',
    headline: 'A maioria das empresas decide com dados do passado.',
    highlight: 'E o futuro?',
    sub: 'boom predict usa machine learning e dados públicos para mostrar onde o mercado vai, e não apenas onde ele estava.',
    color: '#FD6604',
    iconImg: '/boom-predict.png',
    problems: [
      { q: '"Baseio minha estratégia no que funcionou no ano passado."', a: 'O que funcionou no passado não garante o amanhã. O mercado mudou.' },
      { q: '"Contrato consultoria para entender tendências."', a: 'Consultoria entrega 60 páginas. boom predict entrega a decisão.' },
      { q: '"Uso Google Trends."', a: 'Google Trends mostra o que já virou tendência. boom predict o que está virando.' }
    ],
    steps: [
      { n: '01. Ingesta', t: 'Dados do seu mercado', d: 'boom predict cruza dados públicos, históricos e sinais emergentes do seu setor específico.' },
      { n: '02. Modela', t: 'IA escolhe o modelo certo', d: 'Machine learning seleciona automaticamente o modelo preditivo. Sem configuração.' },
      { n: '03. Prevê', t: 'Onde o mercado vai', d: 'Tendências emergentes, projeções de demanda, movimentos setoriais com horizonte de 3 a 12 meses.' }
    ],
    gains: [
      { t: 'Sem estratégia baseada em achismo', d: 'Cada previsão tem metodologia explicada. Você sabe de onde vem.' },
      { t: 'Sem consultorias de 60 páginas', d: 'boom predict entrega a tendência com a direção de ação.' },
      { t: 'Sem lançamento na hora errada', d: 'Saber onde o mercado vai permite lançar produtos na janela certa.' },
      { t: 'Sem configuração técnica', d: 'boom predict escolhe o modelo automaticamente. Você vê o resultado.' }
    ],
    nums: [
      { v: '12m', l: 'horizonte máximo de previsão' },
      { v: '+30', l: 'modelos preditivos disponíveis' },
      { v: 'Auto', l: 'seleção do modelo mais adequado' },
      { v: '0', l: 'configuração técnica necessária' }
    ],
    cta: 'Descobrir tendências'
  }
};

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { openLeadModal } = useLeadModal();

  if (!id || !productData[id]) {
    return <Navigate to="/" />;
  }

  const p = productData[id];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section id="product-hero" className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-[5vw] pt-32 md:pt-40 pb-20 overflow-hidden bg-[#f3f4f9]">
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05]" 
          style={{ background: `radial-gradient(circle at center, ${p.color}, transparent 80%)` }}
        />
        
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 border border-gray-100 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-gray-500 font-normal tracking-[0.1em] mb-8 z-20"
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }}></div>
          <span>{p.tag}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-20 mb-6"
        >
          <h1 className="text-5xl md:text-[80px] font-normal tracking-tighter leading-[0.85] mb-4" style={{ color: p.color }}>
            {p.name}
          </h1>
          <div className="text-3xl md:text-[56px] font-normal text-[#1a1b1e] tracking-tighter leading-[1.1] max-w-[1100px] mx-auto">
            {p.headline}{' '}
            <br className="md:hidden" />
            <span style={{ color: p.color }}>{p.highlight}</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-gray-400 max-w-[650px] leading-relaxed mb-10 font-normal opacity-80 relative z-20"
        >
          {p.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 relative z-20"
        >
          <button 
            onClick={() => openLeadModal(p.cta)}
            className="text-white border-none py-4 px-10 rounded-xl font-normal text-sm shadow-xl transition-all hover:opacity-90 active:scale-95 cursor-pointer" 
            style={{ background: p.color }}
          >
            {p.cta}
          </button>
          <button 
            onClick={() => {
              const element = document.getElementById('como-funciona');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-transparent text-gray-400 border border-gray-200 py-4 px-10 rounded-xl font-normal text-sm hover:bg-white transition-all active:scale-95 leading-none cursor-pointer"
          >
            Como funciona
          </button>
        </motion.div>
        
        <div className="relative z-30 w-full max-w-4xl mx-auto mt-16 md:scale-100">
          <ProductSelector />
        </div>
      </section>

      {/* PROBLEM STRIP */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-3">
          {p.problems.map((pb: any, i: number) => (
            <div key={i} className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <div className="text-sm font-normal italic text-gray-400 leading-relaxed mb-4">{pb.q}</div>
              <div className="text-sm font-medium text-gray-800 leading-relaxed">{pb.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section id="como-funciona" className="py-24 md:py-32 px-[5vw] scroll-mt-24">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-sm font-normal uppercase tracking-[0.2em] mb-6 block" style={{ color: p.color }}>Como funciona</span>
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 tracking-tighter mb-4">Três passos para a clareza.</h2>
          <p className="text-lg text-gray-500 leading-relaxed font-light mb-16 max-w-[560px]">Metodologia pensada para quem tem pressa e precisa de resultado.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {p.steps.map((step: any, i: number) => (
              <div key={i} className="bg-white border border-gray-100 p-10 rounded-[18px] relative overflow-hidden group hover:border-gray-200 transition-all">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <div className="text-xs font-normal tracking-widest mb-10" style={{ color: p.color }}>{step.n}</div>
                <h3 className="text-xl font-normal text-gray-900 mb-4 tracking-tight leading-tight">{step.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light italic">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAINS */}
      <section className="py-24 md:py-32 px-[5vw] bg-white/40">
        <div className="max-w-[1100px] mx-auto">
          <span className="text-sm font-normal uppercase tracking-[0.2em] mb-6 block" style={{ color: p.color }}>O que você para de fazer</span>
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 tracking-tighter mb-16">Elimine a ineficiência.</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {p.gains.map((gain: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-8 bg-white border border-gray-100 rounded-[18px] group shadow-sm shadow-blue-900/5 hover:border-gray-200 transition-all">
                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}22`, color: p.color }}>
                  <Check size={18} strokeWidth={3} />
                </div>
                <div>
                   <h4 className="font-normal text-gray-800 text-sm mb-1">{gain.t}</h4>
                   <p className="text-xs text-gray-400 font-light leading-relaxed">{gain.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {p.nums.map((n: any, i: number) => (
            <div key={i} className="p-10 border-r border-gray-50 last:border-0 text-center md:text-left">
              <div className="text-3xl font-normal text-gray-900 tracking-tight mb-2" style={{ color: p.color }}>{n.v}</div>
              <div className="text-sm text-gray-400 uppercase tracking-widest leading-relaxed font-normal">{n.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="py-32 md:py-48 px-[5vw] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${p.color}, transparent 60%)` }}></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-normal text-gray-900 tracking-tighter leading-tight mb-4">A clareza que seu <br /> negócio precisa.</h2>
          <p className="text-lg text-gray-400 font-light mb-12 italic">Configure em minutos. Decida em segundos.</p>
          <button 
            onClick={() => openLeadModal(p.cta)}
            className="text-white font-normal py-4 px-12 rounded-xl text-lg shadow-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 mx-auto border-none cursor-pointer" 
            style={{ background: p.color }}
          >
            {p.cta} <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
