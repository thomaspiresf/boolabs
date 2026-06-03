import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Clock, ChevronRight, Share2, Send, Linkedin, Twitter, MessageCircle, Sparkles, BookOpen, User } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { blogService, slugify } from '../lib/blogService';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [toc, setToc] = useState<{ text: string; level: number; id: string }[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadPostData = async () => {
      if (!slug) return;
      const data = await blogService.getPostBySlug(slug);
      if (!data) {
        // Fallback or navigate home
        navigate('/blog');
        return;
      }
      setPost(data);

      const list = await blogService.getPosts(false);
      setAllPosts(list);

      // Generate Table Of Contents dynamically based on H2 and H3 from markdown
      const headings: { text: string; level: number; id: string }[] = [];
      const lines = data.content.split('\n');
      
      lines.forEach((line) => {
        if (line.startsWith('## ')) {
          const text = line.replace('## ', '').trim();
          const id = `heading-${slugify(text)}`;
          headings.push({ text, level: 2, id });
        } else if (line.startsWith('### ')) {
          const text = line.replace('### ', '').trim();
          const id = `heading-${slugify(text)}`;
          headings.push({ text, level: 3, id });
        }
      });
      setToc(headings);

      // --- SEO & SOCIAL META TAG DYNAMIC INJECTION ---
      document.title = `${data.seoTitle || data.title} | booblog`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", data.seoDescription || data.excerpt);
      }

      // Article Schema JSON-LD Injection
      let schemaScript = document.getElementById('json-ld-article-schema') as HTMLScriptElement;
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'json-ld-article-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }

      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": data.title,
        "description": data.excerpt,
        "image": data.coverImage,
        "datePublished": data.publishedAt,
        "author": {
          "@type": "Person",
          "name": data.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "boo",
          "logo": {
            "@type": "ImageObject",
            "url": "https://boolabs.com.br/Logo-Boo-Default.svg"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${window.location.origin}/blog/${data.slug}`
        }
      };
      schemaScript.innerHTML = JSON.stringify(articleSchema, null, 2);
    };

    loadPostData();

    // Cleanup schema script on unmount
    return () => {
      const script = document.getElementById('json-ld-article-schema');
      if (script) {
        script.remove();
      }
    };
  }, [slug, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen pt-40 text-center text-slate-500 font-light">
        Carregando artigo...
      </div>
    );
  }

  // Related Articles: up to 3 posts in same category, excluding the current one
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // If we don't have enough posts in the same category, grab other recent ones to make up 3
  if (relatedPosts.length < 3) {
    const additional = allPosts
      .filter(p => p.id !== post.id && !relatedPosts.some(r => r.id === p.id))
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...additional);
  }

  // Prev / Next post links
  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex !== -1 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Social Share helpers
  const shareUrl = encodeURIComponent(`${window.location.origin}/blog/${post.slug}`);
  const shareTitle = encodeURIComponent(post.title);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
  };

  const handleShareClick = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
  };

  // Custom Markdown renderer inside component to render headers with correct scroll anchors
  const renderMarkdownContent = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems: string[] = [];
    const elements: React.ReactNode[] = [];

    const flushList = (keyIndex: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${keyIndex}`} className="list-disc pl-6 mb-5 space-y-2 text-slate-600 font-light text-sm md:text-base">
            {listItems.map((item, itemIdx) => (
              <li key={`li-${itemIdx}`} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      let trimmed = line.trim();

      // Check bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          inList = true;
        }
        const bulletText = trimmed.substring(2);
        // Basic Markdown parser helper inside bullet for strong inline formatting
        const formatted = bulletText
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        listItems.push(formatted);
        return;
      } else {
        if (inList) {
          flushList(index);
          inList = false;
        }
      }

      // Check numbered lists: digits followed by . e.g. "1. "
      if (/^\d+\.\s/.test(trimmed)) {
        const numberedText = trimmed.replace(/^\d+\.\s/, '');
        const formatted = numberedText
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        elements.push(
          <div key={`num-${index}`} className="flex gap-3 items-start mb-4 text-slate-600 font-light text-sm md:text-base">
            <span className="w-5 h-5 rounded-full bg-blue-50 text-[#21659F] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 border border-blue-150/40">
              {trimmed.match(/^\d+/)?.[0]}
            </span>
            <span dangerouslySetInnerHTML={{ __html: formatted }} className="flex-1" />
          </div>
        );
        return;
      }

      // Header H2
      if (trimmed.startsWith('## ')) {
        const headerText = trimmed.replace('## ', '');
        const id = `heading-${slugify(headerText)}`;
        elements.push(
          <h2 key={`h2-${index}`} id={id} className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight mt-10 mb-4 pt-4 scroll-mt-20">
            {headerText}
          </h2>
        );
        return;
      }

      // Header H3
      if (trimmed.startsWith('### ')) {
        const headerText = trimmed.replace('### ', '');
        const id = `heading-${slugify(headerText)}`;
        elements.push(
          <h3 key={`h3-${index}`} id={id} className="text-lg md:text-xl font-medium text-slate-800 tracking-tight mt-7 mb-3 pt-2 scroll-mt-20">
            {headerText}
          </h3>
        );
        return;
      }

      // Empty line
      if (trimmed === '') {
        return;
      }

      // Standard paragraphs
      // Inline styling parser
      const formatted = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-pink-600">$1</code>');

      elements.push(
        <p key={`p-${index}`} className="text-slate-600 font-light text-sm md:text-base leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });

    // Cleanup trailing open list
    if (inList) {
      flushList(lines.length);
    }

    return elements;
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] pt-24 pb-24 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Scroll Background Bar */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-50/15 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-[5vw]">
        
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-xs font-light text-slate-400 mb-8 select-none">
          <Link to="/" className="hover:text-slate-900 transition-colors no-underline">Home</Link>
          <ChevronRight size={12} className="stroke-[1.5]" />
          <Link to="/blog" className="hover:text-slate-900 transition-colors no-underline">Blog</Link>
          <ChevronRight size={12} className="stroke-[1.5]" />
          <span className="text-slate-600 truncate max-w-xs">{post.title}</span>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-light text-slate-500 hover:text-slate-950 transition-colors no-underline">
            <ArrowLeft size={14} /> Voltar para o blog
          </Link>
        </div>

        {/* Article Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Article Body (8 cols on desktop) */}
          <article className="lg:col-span-8 bg-white border border-slate-200/50 rounded-3xl p-5 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
            
            {/* Category and Metas */}
            <header className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] tracking-wide font-normal text-blue-600 mb-4 select-none">
                {post.category}
              </span>
              
              <h1 className="text-2xl md:text-4xl font-normal text-slate-900 tracking-tight leading-snug mb-5">
                {post.title}
              </h1>

              {/* Author & Metas box */}
              <div className="flex flex-wrap gap-4 items-center justify-between border-y border-slate-100 py-3.5 mt-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-150 overflow-hidden">
                    <img src="/boo.svg" alt="boo" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-800 block">Por {post.author || 'boo labs'}</span>
                    <span className="text-[10px] font-light text-slate-400">Autor</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10.5px] font-light text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="stroke-[1.5]" />
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="stroke-[1.5]" />
                    {post.readingTime} de leitura
                  </span>
                </div>
              </div>
            </header>

            {/* Featured Image display */}
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-10 border border-slate-200/40">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt Summary Intro Box */}
            <div className="bg-slate-50/70 border-l-[3px] border-blue-300 rounded-r-xl p-4.5 mb-8 text-xs md:text-[13.5px] font-light text-slate-500 leading-relaxed italic">
              {post.excerpt}
            </div>

            {/* Markdown rendered body */}
            <section className="article-body">
              {renderMarkdownContent(post.content)}
            </section>

            {/* Social Share segment row */}
            <div className="border-t border-slate-100 pt-6 mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 font-mono">
                <Share2 size={13} /> Gostou do artigo? Compartilhe:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShareClick(shareLinks.whatsapp)}
                  className="px-3 py-2 bg-[#25D366]/8 text-[#128C7E] hover:bg-[#25D366]/15 rounded-xl text-[11px] font-normal transition-colors cursor-pointer border border-[#25D366]/15 flex items-center gap-1.5"
                >
                  <MessageCircle size={14} className="fill-current" /> WhatsApp
                </button>
                <button
                  onClick={() => handleShareClick(shareLinks.linkedin)}
                  className="px-3 py-2 bg-[#0077B5]/8 text-[#0077B5] hover:bg-[#0077B5]/15 rounded-xl text-[11px] font-normal transition-colors cursor-pointer border border-[#0077B5]/15 flex items-center gap-1.5"
                >
                  <Linkedin size={14} className="fill-current" /> LinkedIn
                </button>
                <button
                  onClick={() => handleShareClick(shareLinks.twitter)}
                  className="px-3 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl text-[11px] font-normal transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5"
                >
                  <Twitter size={14} className="fill-current" /> Twitter
                </button>
              </div>
            </div>

          </article>

          {/* Right Sidebar Widget (4 cols on desktop) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-20">
            
            {/* 1. TABLE OF CONTENTS WIDGET (Sumário automático) */}
            {toc.length > 0 && (
              <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.01)] text-left select-none">
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-4 pb-2 border-b border-slate-10 */8 flex items-center gap-1.5">
                  <BookOpen size={13} className="text-[#46AAFF]" />
                  Sumário do Artigo
                </h4>
                <nav className="space-y-2">
                  {toc.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left transition-colors font-light text-slate-500 hover:text-blue-600 py-1 cursor-pointer border-none bg-transparent ${
                        item.level === 3 ? 'pl-4 text-[11.5px] border-l border-slate-100' : 'text-xs md:text-[13px]'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* 2. PERSISTENT CALL TO ACTION FROM BOO */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#46AAFF]/10 rounded-full blur-[45px] pointer-events-none -mr-10 -mt-10" />
              <div className="relative z-10">
                <h4 className="text-lg md:text-xl font-normal tracking-tight leading-snug mb-6 pr-4">
                  Dados não deveriam gerar dúvida. Deveriam gerar direção.
                </h4>
                <Link 
                  to="/#hero"
                  className="inline-flex w-full justify-center items-center gap-2 bg-[#21659F] hover:bg-opacity-95 text-white py-2.5 rounded-xl text-xs font-medium tracking-wide no-underline transition-all active:scale-95 shadow-sm"
                >
                  Conhecer a boo <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </aside>
        </div>

        {/* PAGER PREV/NEXT ARROWS SECTION */}
        {(prevPost || nextPost) && (
          <section className="border-t border-slate-200/60 pt-10 mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Prev link */}
              {prevPost ? (
                <Link to={`/blog/${prevPost.slug}`} className="no-underline group text-left">
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2 block">
                      ← Artigo Anterior
                    </span>
                    <span className="text-xs md:text-sm font-normal text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                      {prevPost.title}
                    </span>
                  </div>
                </Link>
              ) : <div />}

              {/* Next link */}
              {nextPost ? (
                <Link to={`/blog/${nextPost.slug}`} className="no-underline group text-right">
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition-all h-full flex flex-col justify-between items-end">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2 block">
                      Próximo Artigo →
                    </span>
                    <span className="text-xs md:text-sm font-normal text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                      {nextPost.title}
                    </span>
                  </div>
                </Link>
              ) : <div />}

            </div>
          </section>
        )}

        {/* RELATED ARTICLES SECTOR */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-slate-200/60 pt-14 mt-16 text-left">
            <h3 className="text-lg md:text-xl font-normal text-slate-900 tracking-tight mb-8">
              Artigos recomendados para você
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => (
                <article key={rPost.id} className="bg-white border border-slate-150 rounded-2xl overflow-hidden flex flex-col h-full group">
                  <Link to={`/blog/${rPost.slug}`} className="no-underline text-slate-900 flex flex-col h-full justify-between">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                        <img 
                          src={rPost.coverImage} 
                          alt={rPost.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4.5 pb-2">
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-blue-500 mb-1.5 block">
                          {rPost.category}
                        </span>
                        <h4 className="text-[13.5px] md:text-[14.5px] font-normal text-slate-850 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1">
                          {rPost.title}
                        </h4>
                      </div>
                    </div>
                    <div className="p-4.5 pt-2 flex items-center justify-between border-t border-slate-50 mt-auto">
                      <span className="text-[11px] font-medium text-slate-500 group-hover:text-blue-600 transition-colors flex items-center">
                        Ler agora <ChevronRight size={12} />
                      </span>
                      <span className="text-[10px] font-mono text-slate-350">{rPost.readingTime}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
