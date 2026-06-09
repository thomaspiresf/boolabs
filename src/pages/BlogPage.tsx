import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Calendar, Clock, ArrowRight, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { blogService } from '../lib/blogService';
import { useTranslation } from 'react-i18next';

export default function BlogPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Update SEO headers dynamically
    document.title = "booblog | Inteligência de Dados & BI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Acompanhe as últimas novidades, tutoriais de Business Intelligence, integrações de ERP e conformidade com a LGPD no blog da boo.");
    }

    // Load posts from the service
    const loadPosts = async () => {
      const data = await blogService.getPosts(false); // Only published posts
      setPosts(data);
    };
    loadPosts();
  }, []);

  // Get active categories
  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

  // Helper mapping values to clean category badges color styles
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'integrações':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'segurança':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'negócios':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'e-commerce':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'tecnologia':
        return 'text-purple-600 bg-purple-50 border-purple-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-150';
    }
  };

  // Filter and Search logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Featured post is the most recently published "featured" flag post, or just the newest overall
  const featuredPost = sortedPosts.find(p => p.featured) || sortedPosts[0];
  const regularPosts = sortedPosts.filter(p => p.id !== (featuredPost?.id || ''));

  // Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPostsList = regularPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  const handlePageChange = (pageNo: number) => {
    setCurrentPage(pageNo);
    // Smooth scroll back to standard catalogue grid
    const gridEl = document.getElementById('articles-catalogue');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] pt-24 pb-20 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-blue-50/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-[5vw]">
        
        {/* Breadcrumb Section */}
        <div className="flex items-center gap-2 text-xs font-light text-slate-400 mb-8 select-none">
          <Link to="/" className="hover:text-slate-900 transition-colors no-underline">Home</Link>
          <ChevronRight size={12} className="stroke-[1.5]" />
          <span className="text-slate-600">Blog</span>
        </div>

        {/* Hero Header */}
        <header className="mb-14 text-left">
          <h1 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
            booblog
          </h1>
          <p className="text-base font-light text-slate-500 max-w-xl leading-relaxed">
            {t('blog.desc')}
          </p>
        </header>

        {/* Search & Categories Tags Section */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-4 md:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.015)] mb-12 flex flex-col md:flex-row gap-5 items-center justify-between">
          
          {/* Categories Horizontal Scrubber */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-xs font-light transition-all cursor-pointer whitespace-nowrap border ${
                    selectedCategory === cat 
                      ? 'bg-slate-950 border-slate-950 text-white shadow-xs' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-950 hover:border-slate-300'
                  }`}
                >
                  {cat === 'all' ? t('blog.view_all') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input 
              type="text"
              placeholder={t('blog.search')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2.5 pl-10 pr-4 text-xs font-light text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all focus:bg-white"
            />
          </div>
        </div>

        {/* Dynamic content */}
        {sortedPosts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-150 rounded-2xl shadow-xs">
            <p className="text-sm font-light text-slate-400 mb-3">{t('blog.not_found')}</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs text-blue-500 font-normal hover:underline cursor-pointer"
            >
              {t('blog.reset')}
            </button>
          </div>
        ) : (
          <>
            {/* FEATURED ARTICLES HERO (Only shown on Page 1 with no search active or category all) */}
            {currentPage === 1 && searchQuery === '' && selectedCategory === 'all' && featuredPost && (
              <section className="mb-16">
                <div className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#21659F] mb-4.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#46AAFF] rounded-full animate-pulse" />
                  {t('blog.featured')}
                </div>
                
                <Link to={`/blog/${featuredPost.slug}`} className="group no-underline">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200/50 rounded-3xl p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.025)] transition-all">
                    
                    {/* Cover image half */}
                    <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 relative">
                      <img 
                        src={featuredPost.coverImage} 
                        alt={featuredPost.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <span className={`absolute top-4 left-4 text-[10px] tracking-wide font-normal px-3 py-1 rounded-full border ${getCategoryColor(featuredPost.category)} shadow-xs`}>
                        {featuredPost.category}
                      </span>
                    </div>

                    {/* Content half */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full py-2">
                      <div>
                        {/* Meta lines */}
                        <div className="flex items-center gap-4 text-[11px] font-light text-slate-400 mb-4 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="stroke-[1.5]" />
                            {new Date(featuredPost.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="stroke-[1.5]" />
                            {featuredPost.readingTime}
                          </span>
                        </div>

                        {/* Title & Excerpt */}
                        <h2 className="text-xl md:text-2xl font-normal text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug mb-3">
                          {featuredPost.title}
                        </h2>
                        
                        <p className="text-xs md:text-sm font-light text-slate-500 leading-relaxed mb-6">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      {/* Read Button */}
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                        {t('blog.read')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>

                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* ARTIGOS CATALOGUE GRID */}
            <section id="articles-catalogue" className="pt-2">
              <h3 className="text-[10px] uppercase font-semibold tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-2">
                <Filter size={12} />
                {selectedCategory !== 'all' ? `${t('blog.articles_of')} ${selectedCategory}` : t('blog.recent')}
              </h3>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(selectedCategory !== 'all' || searchQuery !== '' ? sortedPosts : currentPostsList).map((post, idx) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden flex flex-col justify-between h-full shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-slate-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.02)] transition-colors group"
                  >
                    <Link to={`/blog/${post.slug}`} className="no-underline text-slate-900 flex flex-col h-full justify-between">
                      
                      {/* Image header */}
                      <div>
                        <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <span className={`absolute top-3 left-3 text-[9px] tracking-wide font-normal px-2.5 py-0.5 rounded-full border ${getCategoryColor(post.category)} shadow-xxs`}>
                            {post.category}
                          </span>
                        </div>

                        {/* Content main */}
                        <div className="p-5 md:p-6 pb-4">
                          {/* Metas inside */}
                          <div className="flex items-center gap-4 text-[10px] font-light text-slate-400 mb-3 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} className="stroke-[1.5]" />
                              {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="stroke-[1.5]" />
                              {post.readingTime}
                            </span>
                          </div>

                          <h4 className="text-base font-normal text-slate-850 group-hover:text-blue-600 transition-colors tracking-tight leading-snug mb-2.5">
                            {post.title}
                          </h4>
                          <p className="text-[11px] md:text-xs font-light text-slate-400 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Footer read actions */}
                      <div className="p-5 md:p-6 pt-0 flex items-center justify-between border-t border-slate-50 mt-auto">
                        <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                          {t('blog.read')} <ChevronRight size={14} className="stroke-[1.5] group-hover:translate-x-0.5 transition-transform" />
                        </span>
                        <span className="text-[10px] font-light text-slate-400">Por {post.author || 'boo labs'}</span>
                      </div>

                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* PAGINATION (Only show if viewing regular posts without active search or filtered categories) */}
              {selectedCategory === 'all' && searchQuery === '' && totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-12">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3.5 py-2 rounded-xl text-xs font-light bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-350 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                  >
                    {t('blog.prev')}
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNo = i + 1;
                    return (
                      <button
                        key={pageNo}
                        onClick={() => handlePageChange(pageNo)}
                        className={`w-9 h-9 rounded-xl text-xs font-light transition-colors cursor-pointer ${
                          currentPage === pageNo 
                            ? 'bg-slate-950 text-white font-medium' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-305'
                        }`}
                      >
                        {pageNo}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3.5 py-2 rounded-xl text-xs font-light bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-350 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                  >
                    {t('blog.next')}
                  </button>
                </div>
              )}
            </section>
          </>
        )}

      </div>
    </div>
  );
}
