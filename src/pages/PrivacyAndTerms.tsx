import React from 'react';
import { Shield, Lock, Scale, CheckCircle, ArrowLeft, Building2, UserCheck, ShieldAlert, Eye, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PrivacyAndTerms() {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-[5vw]">
      <div className="max-w-[850px] w-full mx-auto">
        
        {/* Breadcrumb e Voltar */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest no-underline">
            <ArrowLeft size={12} /> {t('privacy.back')}
          </Link>
        </div>

        {/* Cabeçalho Editorial */}
        <div className="mb-12 border-b border-slate-200/60 pb-8">
          <span className="text-xs font-bold tracking-[0.2em] text-[#46AAFF] uppercase block mb-3">{t('privacy.badge')}</span>
          <h1 className="text-[32px] md:text-[38px] font-normal text-slate-900 tracking-tighter leading-tight mb-4">
            {t('privacy.title')}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono text-slate-500 bg-slate-100/60 rounded-xl px-4 py-3 border border-slate-200/30">
            <div className="flex items-center gap-1.5">
              <Building2 size={13} className="text-[#46AAFF]" />
              <span className="font-semibold text-slate-700">{t('privacy.company')}</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div>
              <span className="text-slate-400">{t('privacy.cnpj')}</span> <span className="font-semibold text-slate-700">62.460.954/0001-34</span>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white border border-slate-100/90 rounded-[24px] p-6 md:p-12 shadow-sm shadow-slate-900/4 select-text space-y-10">
          
          {/* Seção 1 */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">1</span>
              {t('privacy.s1_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                {t('privacy.s1_p1')}
              </p>
              <p>
                {t('privacy.s1_p2')}
              </p>
              <p>
                {t('privacy.s1_p3')}
              </p>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">2</span>
              {t('privacy.s2_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                {t('privacy.s2_p')}
              </p>
              <ul className="space-y-2 mt-2">
                {(t('privacy.s2_list', { returnObjects: true }) as string[]).map((bullet, idx) => (
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
              {t('privacy.s3_1_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                {t('privacy.s3_1_p')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {(t('privacy.s3_1_list', { returnObjects: true }) as any[]).map((princ, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100/80 p-3 rounded-xl flex flex-col gap-0.5">
                    <span className="font-semibold text-xs text-slate-900 uppercase tracking-wide">{princ.t}</span>
                    <span className="text-xs text-slate-500 font-light leading-tight">{princ.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 3.2 - Bases Legais */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">3</span>
              {t('privacy.s3_2_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                {t('privacy.s3_2_p1')}
              </p>
              <ul className="space-y-2.5">
                {(t('privacy.s3_2_list', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-600">
                    <span className="text-[#46AAFF] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[#46AAFF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 text-xs text-blue-900 leading-relaxed font-light">
                {t('privacy.s3_2_p2')}
              </p>
            </div>
          </section>

          {/* Seção 4 - Direitos dos Titulares */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">4</span>
              {t('privacy.s4_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                {t('privacy.s4_p1')}
              </p>
              <ul className="space-y-2">
                {(t('privacy.s4_list', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle size={14} className="text-[#46AAFF] mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="font-normal text-slate-800">
                {t('privacy.s4_p2')}
              </p>

              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 md:p-6 mt-4 space-y-3">
                <span className="font-medium text-slate-950 block text-xs tracking-wider uppercase">{t('privacy.s4_box_title')}</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('privacy.s4_box_p1')}
                </p>
                <ul className="space-y-1 text-xs text-slate-600 pl-4 list-decimal font-mono">
                  {(t('privacy.s4_box_list', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-400 italic">
                  {t('privacy.s4_box_p2')}
                </p>
              </div>
            </div>
          </section>

          {/* Seção 5 - Medidas de Segurança */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">5</span>
              {t('privacy.s5_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                {t('privacy.s5_p')}
              </p>
              <ul className="space-y-2 mt-2">
                {(t('privacy.s5_list', { returnObjects: true }) as string[]).map((item, idx) => (
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
              {t('privacy.s6_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                {t('privacy.s6_p1')}
              </p>
              <p>
                {t('privacy.s6_p2')}
              </p>
            </div>
          </section>

          {/* Seção 7 - Compartilhamento */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">7</span>
              {t('privacy.s7_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                {t('privacy.s7_p1')}
              </p>
              <ul className="space-y-1.5 my-2 pl-4 list-disc text-slate-600">
                {(t('privacy.s7_list', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p>
                {t('privacy.s7_p2')}
              </p>
            </div>
          </section>

          {/* Seção 8 - DPO */}
          <section className="space-y-4 bg-slate-50 border border-slate-100 p-5 md:p-8 rounded-2xl">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2 mb-2 uppercase">
              <UserCheck size={18} className="text-[#46AAFF]" />
              {t('privacy.s8_title')}
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed font-light space-y-4">
              <p>
                {t('privacy.s8_p1')}
              </p>
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-2 max-w-[350px]">
                <div className="text-xs"><span className="text-slate-400 font-mono">{t('privacy.s8_name')}</span> <span className="font-semibold text-slate-900">Vinicius Ruan Cainelli</span></div>
                <div className="text-xs"><span className="text-slate-400 font-mono">{t('privacy.s8_cpf')}</span> <span className="font-semibold text-slate-900">371.964.068-00</span></div>
                <div className="text-xs"><span className="text-slate-400 font-mono">{t('privacy.s8_email')}</span> <a href="mailto:vinicius@boolabs.ai" className="font-semibold text-[#46AAFF] hover:underline">vinicius@boolabs.ai</a></div>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                {t('privacy.s8_p2')}
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 font-light list-disc pl-5">
                {(t('privacy.s8_list', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Seção 9 - Treinamento */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">9</span>
              {t('privacy.s9_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                {t('privacy.s9_p1')}
              </p>
              <p>
                {t('privacy.s9_p2')}
              </p>
            </div>
          </section>

          {/* Seção 10 - Atualizações */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-slate-900 tracking-tight flex items-center gap-2.5 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold bg-[#46AAFF]/10 text-[#46AAFF] px-2 py-0.5 rounded-md font-mono">10</span>
              {t('privacy.s10_title')}
            </h2>
            <div className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-light space-y-3">
              <p>
                {t('privacy.s10_p1')}
              </p>
              <p>
                {t('privacy.s10_p2')}
              </p>
            </div>
          </section>

          {/* Rodapé e Versão */}
          <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div>
              <p>{t('privacy.footer_v')}</p>
              <p>{t('privacy.footer_date')} <span className="text-yellow-600 font-semibold bg-yellow-50 px-1 py-0.5 rounded-md">23/09/2025</span></p>
            </div>
            <div className="sm:text-right font-sans not-italic">
              <p className="font-semibold text-slate-700">{t('privacy.footer_appr')}</p>
              <p>{t('privacy.footer_contact')} <a href="mailto:vinicius@boolabs.ai" className="text-[#46AAFF] hover:underline">vinicius@boolabs.ai</a></p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
