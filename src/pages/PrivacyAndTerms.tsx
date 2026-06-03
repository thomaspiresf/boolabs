import React from 'react';
import { Shield, Lock, Scale, CheckCircle, ArrowLeft, Building2, UserCheck, ShieldAlert, Eye, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyAndTerms() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-[5vw]">
      <div className="max-w-[850px] w-full mx-auto">
        
        {/* Breadcrumb e Voltar */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest no-underline">
            <ArrowLeft size={12} /> voltar para home
          </Link>
        </div>

        {/* Cabeçalho Editorial */}
        <div className="mb-12 border-b border-slate-200/60 pb-8">
          <span className="text-xs font-bold tracking-[0.2em] text-[#46AAFF] uppercase block mb-3">CONFORMIDADE E COMPLIANCE</span>
          <h1 className="text-[32px] md:text-[38px] font-normal text-slate-900 tracking-tighter leading-tight mb-4">
            Política de Proteção de Dados Pessoais – LGPD
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono text-slate-500 bg-slate-100/60 rounded-xl px-4 py-3 border border-slate-200/30">
            <div className="flex items-center gap-1.5">
              <Building2 size={13} className="text-[#46AAFF]" />
              <span className="font-semibold text-slate-700">BOOLABS SISTEMA DE INFORMAÇÃO LTDA</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div>
              <span className="text-slate-400">CNPJ:</span> <span className="font-semibold text-slate-700">62.460.954/0001-34</span>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white border border-slate-100/90 rounded-[24px] p-6 md:p-12 shadow-sm shadow-slate-900/4 select-text space-y-10">
          
          {/* Seção 1 */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">1</span>
              Introdução
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                A <strong className="font-normal text-slate-900">BOOLABS SISTEMA DE INFORMAÇÃO LTDA</strong>, empresa dedicada ao desenvolvimento de soluções em tecnologia, coleta, análise e inteligência artificial, reconhece a privacidade como direito fundamental e a proteção de dados pessoais como pilar de sua governança corporativa.
              </p>
              <p>
                Esta Política de Proteção de Dados Pessoais (“Política”) estabelece as diretrizes, procedimentos e responsabilidades para o tratamento de dados pessoais realizado pela BOOLABS, em plena conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD), com o Marco Civil da Internet (Lei nº 12.965/2014), com as normas complementares da Autoridade Nacional de Proteção de Dados (ANPD) e, quando aplicável, com regulamentações internacionais como o Regulamento Geral de Proteção de Dados da União Europeia (GDPR) em operações transfronteiriças.
              </p>
              <p>
                Comprometemo-nos com a transparência, a segurança da informação, a minimização de dados e o respeito irrestrito aos direitos dos titulares, adotando o conceito de <em className="text-slate-900 font-sans not-italic font-normal">Privacy by Design</em> e <em className="text-slate-900 font-sans not-italic font-normal">by Default</em> em todos os produtos, serviços e processos internos.
              </p>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">2</span>
              Âmbito de Aplicação
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                Esta Política aplica-se a todo tratamento de dados pessoais realizado pela BOOLABS, independentemente do meio (físico ou digital), da localização do titular ou da finalidade, abrangendo:
              </p>
              <ul className="space-y-2 mt-2">
                {[
                  'Clientes, prospects e usuários de plataformas;',
                  'Colaboradores, estagiários, aprendizes e terceirizados;',
                  'Fornecedores, parceiros comerciais e investidores;',
                  'Visitantes do site institucional e participantes de eventos.'
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="text-[#46AAFF] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[#46AAFF]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Seção 3.1 - Princípios da LGPD */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">3</span>
              Princípios da LGPD
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                Todas as atividades de tratamento de dados pessoais observam os seguintes princípios:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {[
                  { title: 'Finalidade', desc: 'tratamento com propósitos legítimos, específicos e informados.' },
                  { title: 'Adequação', desc: 'compatibilidade entre o tratamento e as finalidades informadas.' },
                  { title: 'Necessidade', desc: 'limitação do tratamento ao mínimo necessário.' },
                  { title: 'Livre acesso', desc: 'garantia de consulta facilitada sobre os dados tratados.' },
                  { title: 'Qualidade dos dados', desc: 'exatidão, clareza e atualização.' },
                  { title: 'Transparência', desc: 'informações claras e acessíveis.' },
                  { title: 'Segurança', desc: 'medidas técnicas para proteger os dados.' },
                  { title: 'Prevenção', desc: 'ações para evitar ocorrência de danos.' },
                  { title: 'Não discriminação', desc: 'proibição de uso para fins discriminatórios.' },
                  { title: 'Responsabilização e prestação de contas', desc: 'comprovação de medidas eficazes de conformidade.' }
                ].map((princ, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100/80 p-3 rounded-xl flex flex-col gap-0.5">
                    <span className="font-semibold text-xs text-slate-900 uppercase tracking-wide">{princ.title}</span>
                    <span className="text-xs text-slate-500 font-light leading-tight">{princ.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 3.2 - Bases Legais */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">3</span>
              Bases Legais para o Tratamento
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                O tratamento de dados pessoais pela BOOLABS será realizado exclusivamente com fundamento em uma das hipóteses legais previstas nos arts. 7º e 11 da LGPD, priorizando, sempre que possível, bases não dependentes de consentimento para dados sensíveis. As principais bases utilizadas são:
              </p>
              <ul className="space-y-2.5">
                {[
                  'Consentimento específico, informado, granular e revogável a qualquer momento;',
                  'Cumprimento de obrigação legal ou regulatória (ex.: eSocial, GFIP, notas fiscais);',
                  'Execução de contrato ou de procedimentos preliminares relacionados a contrato do qual seja parte o titular;',
                  'Exercício regular de direitos em processo judicial, administrativo ou arbitral;',
                  'Proteção da vida ou da incolumidade física do titular ou de terceiro;',
                  'Tutela da saúde, em procedimento realizado por profissionais de saúde ou entidades sanitárias;',
                  'Legítimo interesse do controlador, desde que respeitados os direitos e liberdades fundamentais do titular e realizada Avaliação de Legítimo Interesse (LIA) prévia.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-600">
                    <span className="text-[#46AAFF] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[#46AAFF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 text-xs text-blue-900 leading-relaxed font-light">
                Para dados sensíveis, aplicam-se exclusivamente às hipóteses do art. 11 da LGPD, com ênfase em consentimento destacado ou necessidade para tutela da saúde.
              </p>
            </div>
          </section>

          {/* Seção 4 - Direitos dos Titulares */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">4</span>
              Direitos dos Titulares
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                Nos termos dos arts. 17 a 22 da LGPD, garantimos aos titulares, de forma gratuita e em formato simplificado, os seguintes direitos:
              </p>
              <ul className="space-y-2">
                {[
                  'Confirmação da existência de tratamento;',
                  'Acesso aos dados pessoais tratados;',
                  'Correção de dados incompletos, inexatos ou desatualizados;',
                  'Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;',
                  'Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa;',
                  'Eliminação dos dados tratados com base no consentimento;',
                  'Informação sobre entidades públicas e privadas com as quais houve compartilhamento;',
                  'Informação sobre a possibilidade de não fornecer consentimento e suas consequências;',
                  'Revogação do consentimento a qualquer tempo;',
                  'Oposição ao tratamento realizado com fundamento em legítimo interesse ou em desconformidade com a LGPD;',
                  'Revisão de decisões tomadas unicamente com base em tratamento automatizado.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle size={14} className="text-[#46AAFF] mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="font-normal text-slate-800">
                Os direitos serão atendidos em até 15 (quinze) dias corridos, contados do recebimento da solicitação completa, com possibilidade de prorrogação justificada por mais 15 dias em casos complexos.
              </p>

              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 md:p-6 mt-4 space-y-3">
                <span className="font-medium text-slate-950 block text-xs tracking-wider uppercase">Como exercer seus direitos</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  O titular poderá exercer seus direitos por meio de solicitação escrita encaminhada ao DPO através do e-mail <strong className="font-semibold text-[#46AAFF] hover:underline cursor-pointer">dpo@boolabs.com.br</strong>. A solicitação deverá conter:
                </p>
                <ul className="space-y-1 text-xs text-slate-600 pl-4 list-decimal font-mono">
                  <li>Nome completo e CPF/CNPJ;</li>
                  <li>Descrição clara do direito a ser exercido;</li>
                  <li>Documentos comprobatórios, se necessário.</li>
                </ul>
                <p className="text-[11px] text-slate-400 italic">
                  A BOOLABS reserva-se o direito de solicitar comprovação de identidade para evitar fraudes. Solicitações manifestamente infundadas ou excessivas poderão ser recusadas com justificativa.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 5 - Medidas de Segurança */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">5</span>
              Medidas de Segurança
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                A BOOLABS adota um Programa de Governança em Privacidade com medidas técnicas, administrativas e organizacionais proporcionas aos riscos, incluindo:
              </p>
              <ul className="space-y-2 mt-2">
                {[
                  'Política de Controle de Acesso baseada em RBAC (Role-Based Access Control) e princípio do menor privilégio;',
                  'Criptografia de dados em trânsito (TLS 1.3) e em repouso (AES-256);',
                  'Backups criptografados com retenção 3-2-1 e testes de restauração semestrais;',
                  'Autenticação multifator (MFA) obrigatória para sistemas críticos;',
                  'Firewall de próxima geração (NGFW), WAF e EDR;',
                  'Monitoramento contínuo com SIEM e resposta a incidentes em até 2 horas;',
                  'Política de Clean Desk, Clear Screen e descarte seguro de mídias;',
                  'Testes de intrusão (pentest) anuais realizados por empresa certificada ISO 27001;',
                  'Treinamento obrigatório em phishing e engenharia social com simulações trimestrais.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="text-[#46AAFF] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[#46AAFF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Seção 6 - Retenção e Eliminação */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">6</span>
              Retenção e Eliminação de Dados
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                Os dados pessoais serão retidos apenas pelo tempo necessário ao cumprimento da finalidade do tratamento, observando prazos legais e regulatórios.
              </p>
              <p>
                Encerrada a finalidade ou prazo, os dados serão eliminados, anonimizados ou arquivados de forma segura, conforme o artigo 16 da LGPD.
              </p>
            </div>
          </section>

          {/* Seção 7 - Compartilhamento */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">7</span>
              Compartilhamento de Dados
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                Poderemos compartilhar dados pessoais com:
              </p>
              <ul className="space-y-1.5 my-2 pl-4 list-disc text-slate-600">
                <li>Prestadores de serviços contratados (mediante cláusulas de proteção de dados);</li>
                <li>Órgãos públicos, mediante obrigação legal;</li>
                <li>Terceiros, com consentimento do titular ou base legal apropriada.</li>
              </ul>
              <p>
                Em caso de transferência internacional de dados, serão observados os requisitos do artigo 33 da LGPD.
              </p>
            </div>
          </section>

          {/* Seção 8 - DPO */}
          <section className="space-y-4 bg-slate-50 border border-slate-100 p-5 md:p-8 rounded-2xl">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2 mb-2 uppercase">
              <UserCheck size={18} className="text-[#46AAFF]" />
              8. Encarregado pelo Tratamento de Dados (DPO)
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                Nos termos do artigo 41 da LGPD, a BOOLABS nomeou como Encarregado de Dados (DPO):
              </p>
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-2 max-w-[350px]">
                <div className="text-xs"><span className="text-slate-400 font-mono">Nome:</span> <span className="font-semibold text-slate-900">Vinicius Ruan Cainelli</span></div>
                <div className="text-xs"><span className="text-slate-400 font-mono">CPF:</span> <span className="font-semibold text-slate-900">371.964.068-00</span></div>
                <div className="text-xs"><span className="text-slate-400 font-mono">E-mail:</span> <a href="mailto:vinicius@boolabs.ai" className="font-semibold text-[#46AAFF] hover:underline">vinicius@boolabs.ai</a></div>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Responsabilidades do DPO:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 font-light list-disc pl-5">
                <li>Atender dúvidas e solicitações dos titulares;</li>
                <li>Interagir com a Autoridade Nacional de Proteção de Dados (ANPD);</li>
                <li>Orientar a empresa quanto ao cumprimento da LGPD.</li>
              </ul>
            </div>
          </section>

          {/* Seção 9 - Treinamento */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">9</span>
              Treinamento e Conformidade
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                Todos os colaboradores da BOOLABS participarão de treinamentos periódicos sobre segurança da informação e proteção de dados.
              </p>
              <p>
                A empresa monitora continuamente a conformidade desta política e poderá aplicar sanções internas em caso de descumprimento.
              </p>
            </div>
          </section>

          {/* Seção 10 - Atualizações */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">10</span>
              Atualizações da Política
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                Esta política será revisada periodicamente ou sempre que houver mudanças legais relevantes.
              </p>
              <p>
                A versão atualizada estará disponível no site institucional da BOOLABS ou mediante solicitação.
              </p>
            </div>
          </section>

          {/* Rodapé e Versão */}
          <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div>
              <p>Versão: 1.0</p>
              <p>Data de publicação: <span className="text-yellow-600 font-semibold bg-yellow-50 px-1 py-0.5 rounded-md">23/09/2025</span></p>
            </div>
            <div className="sm:text-right font-sans not-italic">
              <p className="font-semibold text-slate-700">Aprovada por: Diretoria da BOOLABS SISTEMA DE INFORMAÇÃO LTDA</p>
              <p>Contato do DPO: <a href="mailto:vinicius@boolabs.ai" className="text-[#46AAFF] hover:underline">vinicius@boolabs.ai</a></p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
