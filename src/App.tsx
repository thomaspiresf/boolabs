import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { LeadModalProvider } from './context/LeadModalContext';

const Home = React.lazy(() => import('./pages/Home'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));
const PrivacyAndTerms = React.lazy(() => import('./pages/PrivacyAndTerms'));
const SupportPage = React.lazy(() => import('./pages/SupportPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const QuemSomosPage = React.lazy(() => import('./pages/QuemSomosPage'));

const PageLoader = () => (
  <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-10 bg-slate-50">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-[#46AAFF] rounded-full animate-spin shadow-sm mb-4"></div>
    <p className="text-slate-400 text-sm font-medium animate-pulse tracking-wide uppercase">Carregando...</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <LeadModalProvider>
        <Layout>
          <React.Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/politica-de-privacidade" element={<PrivacyAndTerms />} />
              <Route path="/politica-e-termos" element={<PrivacyAndTerms />} />
              <Route path="/suporte" element={<SupportPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/quem-somos" element={<QuemSomosPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blog/admin" element={<AdminPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </React.Suspense>
        </Layout>
      </LeadModalProvider>
    </Router>
  );
}
