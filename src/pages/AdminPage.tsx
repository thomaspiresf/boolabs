import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit3, Trash2, Globe, EyeOff, Image, FolderPlus, Save, ArrowLeft, 
  Eye, RefreshCw, Upload, CheckCircle2, ChevronRight, ChevronLeft, Check, Lock, ShieldCheck, 
  LogOut, Search, Download, Clipboard, FileText, Calendar, Filter, Archive, CheckCircle, Clock,
  Database, Users, UserPlus, Mail
} from 'lucide-react';
import { BlogPost } from '../types/blog';
import { Lead } from '../types/lead';
import { AdminUser } from '../types/adminUser';
import { blogService } from '../lib/blogService';
import { leadService } from '../lib/leadService';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'list' | 'editor' | 'categories' | 'users'>('leads');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Authentication states
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin user list states
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isResettingUser, setIsResettingUser] = useState<string | null>(null);

  // Password Reset simulation states
  const [simulatedEmailDetails, setSimulatedEmailDetails] = useState<{ email: string; token: string } | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [isRequestingResetToken, setIsRequestingResetToken] = useState(false);
  const [manualNewPasswordInput, setManualNewPasswordInput] = useState('');
  const [manualConfirmPasswordInput, setManualConfirmPasswordInput] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [resetRequestedSuccess, setResetRequestedSuccess] = useState(false);

  // blog content states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['Integrações', 'Segurança', 'Negócios', 'E-commerce', 'Tecnologia']);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Supabase states for live diagnostics
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<any>(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);

  // CRM Contacts/Leads states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Novo' | 'Contatado' | 'Em Andamento' | 'Arquivado'>('Todos');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [leadStatus, setLeadStatus] = useState<Lead['status']>('Novo');

  // blog Form Fields
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('Thomas Pires');
  const [category, setCategory] = useState('Integrações');
  const [published, setPublished] = useState(true);
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Feedback notifications
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Unsplash presets selection list
  const unsplashPresets = [
    { name: 'Monitoramento & Gráficos', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Segurança Cibernética', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Dashboards Analíticos', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Comércio On-line', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Processador de Código', url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Conexões em Nuvem', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  ];

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load Posts
      const list = await blogService.getPosts(true);
      setPosts(list);

      // Collect categories automatically
      const autoCats = Array.from(new Set(list.map(p => p.category)));
      const baseCategories = ['Integrações', 'Segurança', 'Negócios', 'E-commerce', 'Tecnologia'];
      const uniqueCats = Array.from(new Set([...baseCategories, ...autoCats])).filter(Boolean);
      setCategories(uniqueCats);

      // Load leads from server database
      const leadsList = await leadService.getLeads();
      setLeads(leadsList);
    } catch (err) {
      console.error("Error loading data in Admin page:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkAuthStatus = async () => {
      const isAuth = await blogService.isAuthenticated();
      setAuthenticated(isAuth);
      setIsVerifyingAuth(false);
      if (isAuth) {
        loadAllData();
      }
    };
    checkAuthStatus();

    // Check for reset_token query parameter to trigger password redefine workflow securely
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('reset_token');
    if (resetToken) {
      setIsResetMode(true);
      setSimulatedEmailDetails({ email: '', token: resetToken });
      setManualTokenInput(resetToken);
      
      // Clean query parameter from URL bar to prevent confusion
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleShowNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Convert File uploads to Base64 String automatically
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        handleShowNotification("A imagem deve ter no máximo 5MB de tamanho", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        handleShowNotification("Upload de imagem concluído com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setAuthor(post.author);
    setCategory(post.category);
    setPublished(post.published);
    setTagsInput(post.tags.join(', '));
    setFeatured(post.featured);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');

    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewClick = () => {
    setEditingPostId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverImage(unsplashPresets[0].url); // select first preset
    setAuthor('Thomas Pires');
    setCategory(categories[0] || 'Integrações');
    setPublished(true);
    setTagsInput('');
    setFeatured(false);
    setSeoTitle('');
    setSeoDescription('');

    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza de que deseja excluir permanentemente o artigo "${title}"? esta ação é irreversível.`)) {
      const success = await blogService.deletePost(id);
      if (success) {
        handleShowNotification("Artigo excluído permanentemente da base.");
        loadAllData();
      } else {
        handleShowNotification("Falha ao excluir o artigo.", "error");
      }
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const updated = await blogService.updatePost(post.id, { published: !post.published });
      handleShowNotification(updated.published ? "Artigo publicado com sucesso!" : "Artigo recolhido em rascunhos.");
      loadAllData();
    } catch (err) {
      handleShowNotification("Houve um erro ao atualizar o status.", "error");
    }
  };

  const handleCategoryAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (categories.includes(clean)) {
      handleShowNotification("Essa categoria já existe.", "error");
      return;
    }
    setCategories([...categories, clean]);
    setNewCategoryName('');
    handleShowNotification("Categoria adicionada!");
  };

  const handleCategoryDelete = (categoryToDelete: string) => {
    if (window.confirm(`Excluir a categoria "${categoryToDelete}"? Os artigos existentes não serão excluídos, mas você precisará reatribuí-los.`)) {
      setCategories(categories.filter(c => c !== categoryToDelete));
      handleShowNotification("Categoria removida.");
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      handleShowNotification("Por favor, preencha o título, resumo e o conteúdo principal.", "error");
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const postPayload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage || unsplashPresets[0].url,
      author: author.trim() || 'Thomas Pires',
      category: category,
      tags: parsedTags,
      featured,
      published,
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || excerpt.trim()
    };

    try {
      if (editingPostId) {
        await blogService.updatePost(editingPostId, postPayload);
        handleShowNotification("Artigo atualizado com sucesso!");
      } else {
        await blogService.createPost(postPayload);
        handleShowNotification("Artigo criado e adicionado ao catálogo!");
      }
      
      loadAllData();
      setActiveTab('list');
    } catch (err) {
      console.error(err);
      handleShowNotification("Erro ao processar salvamento do artigo.", "error");
    }
  };

  // Lead CRM Operations
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadNotes(lead.notes || '');
    setLeadStatus(lead.status);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;

    try {
      const updated = await leadService.updateLead(selectedLead.id, {
        notes: leadNotes,
        status: leadStatus,
      });

      // Update in local state list
      setLeads(prevLeads => prevLeads.map(l => l.id === selectedLead.id ? { ...l, notes: leadNotes, status: leadStatus } : l));
      setSelectedLead({ ...selectedLead, notes: leadNotes, status: leadStatus });
      handleShowNotification("Ficha do contato atualizada com sucesso.");
    } catch (err) {
      handleShowNotification("Houve um erro ao salvar as alterações do lead.", "error");
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (window.confirm(`Excluir permanentemente o contato de "${name}"?`)) {
      try {
        await leadService.deleteLead(id);
        setLeads(prevLeads => prevLeads.filter(l => l.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
        handleShowNotification("Contato removido do CRM.");
      } catch (err) {
        handleShowNotification("Erro ao excluir o contato.", "error");
      }
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      handleShowNotification("Nenhum lead disponível para exportação.", "error");
      return;
    }

    try {
      // Build simple CSV file string
      const headers = ['ID', 'Data', 'Nome', 'Email', 'Origem (CTA)', 'Mensagem', 'Status', 'Notas Administrativas'];
      const rows = leads.map(l => [
        l.id,
        new Date(l.timestamp).toLocaleString('pt-BR'),
        `"${l.name.replace(/"/g, '""')}"`,
        l.email,
        `"${l.cta.replace(/"/g, '""')}"`,
        `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        l.status,
        `"${(l.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boo_leads_crm_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      handleShowNotification("Carga de leads baixada em .CSV com sucesso!");
    } catch (err) {
      handleShowNotification("Erro ao exportar base.", "error");
    }
  };

  const handleTestSupabaseConnection = async () => {
    setIsTestingSupabase(true);
    try {
      const res = await fetch("/api/supabase-status");
      const data = await res.json();
      setSupabaseTestStatus(data);
      if (data.success) {
        handleShowNotification("Supabase conectado e validado com sucesso!");
      } else {
        handleShowNotification("Erro ou aviso de conexão com o Supabase.", "error");
      }
    } catch (err) {
      console.error(err);
      handleShowNotification("Erro de rede ao conectar com o endpoint de teste.", "error");
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const loadAdminUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const list = await blogService.getAdminUsers();
      setAdminUsers(list);
    } catch (err) {
      console.error("Error loading admin users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminPassword) return;
    setIsAddingUser(true);
    try {
      const created = await blogService.createAdminUser(newAdminEmail, newAdminPassword);
      if (created) {
        setAdminUsers(prev => [...prev, created]);
        setNewAdminEmail('');
        setNewAdminPassword('');
        handleShowNotification("Novo administrador cadastrado com sucesso!");
      }
    } catch (err: any) {
      handleShowNotification(err.message || "Erro ao adicionar usuário.", "error");
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleDeleteAdminUser = async (id: string, email: string) => {
    if (adminUsers.length <= 1) {
      handleShowNotification("Não é possível remover o único administrador restante.", "error");
      return;
    }
    if (window.confirm(`Excluir permanentemente o acesso do email "${email}"?`)) {
      try {
        const ok = await blogService.deleteAdminUser(id);
        if (ok) {
          setAdminUsers(prev => prev.filter(u => u.id !== id));
          handleShowNotification("Acesso desativado e removido com sucesso.");
        } else {
          handleShowNotification("Houve um erro ao excluir acesso.", "error");
        }
      } catch (err) {
        handleShowNotification("Não foi possível processar a remoção.", "error");
      }
    }
  };

  const handleResetUserPassword = async (email: string) => {
    setIsResettingUser(email);
    try {
      const res = await blogService.requestPasswordReset(email);
      if (res.success) {
        handleShowNotification(res.message, "success");
        // Securely clear any details so no modals pop up immediately for the dashboard operator
        setSimulatedEmailDetails(null);
      } else {
        handleShowNotification(res.error || "Erro ao solicitar redefinição de senha.", "error");
      }
    } catch (err) {
      console.error("Error requesting password reset:", err);
      handleShowNotification("Ocorreu um erro ao solicitar a redefinição de senha.", "error");
    } finally {
      setIsResettingUser(null);
    }
  };

  const handlePublicResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailInput) return;
    setIsRequestingResetToken(true);
    setLoginError('');
    try {
      const res = await blogService.requestPublicPasswordReset(resetEmailInput);
      if (res.success) {
        handleShowNotification(res.message, "success");
        // Safe: Set request success state to show instructions screen, do not expose token or trigger popup modals
        setResetRequestedSuccess(true);
        setManualNewPasswordInput('');
        setManualConfirmPasswordInput('');
        setManualTokenInput('');
      } else {
        setLoginError(res.error || "E-mail não cadastrado ou erro ao solicitar.");
      }
    } catch (err) {
      setLoginError("Erro ao solicitar a redefinição de senha.");
    } finally {
      setIsRequestingResetToken(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedEmailDetails || !manualNewPasswordInput) return;
    if (manualNewPasswordInput !== manualConfirmPasswordInput) {
      handleShowNotification("As senhas não coincidem.", "error");
      return;
    }
    const finalToken = simulatedEmailDetails.token || manualTokenInput;
    if (!finalToken) {
      handleShowNotification("Por favor, digite o código de autorização.", "error");
      return;
    }
    setIsConfirmingReset(true);
    try {
      const res = await blogService.confirmPasswordReset(finalToken, manualNewPasswordInput);
      if (res.success) {
        handleShowNotification(res.message, "success");
        setSimulatedEmailDetails(null);
        setIsResetMode(false);
        setManualTokenInput('');
        setManualNewPasswordInput('');
        setManualConfirmPasswordInput('');
        if (authenticated) {
          loadAdminUsers();
        }
      } else {
        handleShowNotification(res.error || "Erro ao redefinir a senha.", "error");
      }
    } catch {
      handleShowNotification("Não foi possível redefinir a senha.", "error");
    } finally {
      setIsConfirmingReset(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await blogService.login(emailInput, passwordInput);
      if (res.success) {
        setAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(res.error || 'Acesso negado. Verifique o email e senha e tente novamente.');
      }
    } catch {
      setLoginError('Houve um erro ao se comunicar com o servidor.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    blogService.logout();
    setAuthenticated(false);
    setPosts([]);
    setLeads([]);
    setAdminUsers([]);
  };

  // Filter Leads row calculation
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.cta.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'Todos') return matchesSearch;
    return matchesSearch && l.status === statusFilter;
  });

  // KPI Calculations
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'Novo' || !l.status).length;
  const inProgressCount = leads.filter(l => l.status === 'Em Andamento').length;

  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center pt-24 pb-24 text-center">
        <div className="bg-white border border-slate-200/50 p-8 rounded-3xl shadow-sm text-center max-w-sm w-full mx-4 flex flex-col items-center gap-4">
          <RefreshCw size={24} className="animate-spin text-[#21659F]" />
          <span className="text-xs font-light text-slate-500">Verificando credenciais de acesso...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center pt-24 pb-24 selection:bg-blue-105 selection:text-white">
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-50/15 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] max-w-md w-full mx-4 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -mr-4 -mt-4" />
          
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#21659F] mx-auto mb-6">
            <Lock size={20} className="stroke-[1.5]" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-blue-500 block mb-1">Console Administrativo da boo</span>
          
          {!isResetMode ? (
            <>
              <h2 className="text-xl md:text-2xl font-normal text-slate-800 tracking-tight leading-snug mb-2">
                Acesso Restrito
              </h2>
              <p className="text-xs font-light text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed font-sans">
                Faça login com seu e-mail e senha corporativa da boo para editar o site, artigos, e gerenciar contatos de vendas.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left font-sans">
                <div>
                  <label className="block text-[10.5px] font-medium text-slate-600 mb-1.5 font-mono">E-mail Administrativo:</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: seu-nome@boolabs.com.br"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-light text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all mb-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10.5px] font-medium text-slate-600 font-mono">Senha de Acesso:</label>
                    <button
                      type="button"
                      onClick={() => { setIsResetMode(true); setLoginError(''); setResetEmailInput(''); }}
                      className="text-[10px] font-sans font-medium text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none p-0 cursor-pointer shadow-none"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Sua senha de acesso..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-light text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-650 border-none bg-transparent cursor-pointer p-0 select-none flex items-center shadow-none"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-red-50 border border-red-100 text-red-650 rounded-xl p-3 text-[11px] font-light flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span>{loginError}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full justify-center bg-slate-900 hover:bg-slate-955 text-white font-medium text-xs tracking-wide py-2.5 rounded-xl cursor-pointer transition-all active:scale-98 flex items-center gap-2 shadow-xs disabled:opacity-75"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Verificando...
                    </>
                  ) : (
                    <>
                      Entrar no Console <ChevronRight size={13} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : resetRequestedSuccess ? (
            <div className="text-center py-4 font-sans max-w-xs mx-auto">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={22} className="text-blue-500" />
              </div>
              <h2 className="text-lg font-medium text-slate-800 mb-2">Instruções Enviadas!</h2>
              <p className="text-xs font-light text-slate-500 leading-relaxed mb-6">
                Caso este e-mail esteja cadastrado como administrador, enviamos as instruções com um link seguro para redefinição direto para sua caixa de entrada.
                <br /><br />
                Verifique seu <strong>e-mail</strong> e clique no link seguro para prosseguir.
              </p>
              <button
                type="button"
                onClick={() => { setIsResetMode(false); setResetRequestedSuccess(false); setLoginError(''); }}
                className="w-full justify-center bg-slate-900 hover:bg-slate-955 text-white font-sans font-medium text-xs py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              >
                Voltar para o Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-normal text-slate-800 tracking-tight leading-snug mb-2">
                Recuperar Senha
              </h2>
              <p className="text-xs font-light text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed font-sans">
                Digite seu e-mail administrativo registrado para gerar o link seguro de redefinição e enviá-lo diretamente para sua caixa de entrada.
              </p>

              <form onSubmit={handlePublicResetRequest} className="space-y-4 text-left font-sans">
                <div>
                  <label className="block text-[10.5px] font-medium text-slate-600 mb-1.5 font-mono">Seu E-mail Administrativo:</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: contato@boolabs.com.br"
                    value={resetEmailInput}
                    onChange={(e) => setResetEmailInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-light text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all mb-1"
                  />
                </div>

                {loginError && (
                  <motion.div 
                     initial={{ opacity: 0, y: -5 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     className="bg-red-50 border border-red-100 text-red-650 rounded-xl p-3 text-[11px] font-light flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span>{loginError}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isRequestingResetToken}
                  className="w-full justify-center bg-slate-900 hover:bg-slate-950 text-white font-medium text-xs tracking-wide py-2.5 rounded-xl cursor-pointer transition-all active:scale-98 flex items-center gap-2 shadow-xs disabled:opacity-75"
                >
                  {isRequestingResetToken ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Verificando cadastro...
                    </>
                  ) : (
                    <>
                      Enviar Link de Redefinição <ChevronRight size={13} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setIsResetMode(false); setLoginError(''); }}
                  className="w-full justify-center bg-transparent hover:bg-slate-50 text-slate-600 font-sans font-medium text-xs py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 border border-slate-200"
                >
                  Voltar para o Login
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link 
              to="/" 
              className="text-[11px] font-light text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1.5 no-underline justify-center font-sans"
            >
              <ArrowLeft size={12} /> Voltar para o site público
            </Link>
          </div>
        </motion.div>

        {/* Floating Reset Modal inside login page if active */}
        {simulatedEmailDetails && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full text-left relative overflow-hidden font-sans"
            >
              {/* Security Shield Banner */}
              <div className="bg-blue-50 border-b border-blue-100 p-4 -mx-6 -mt-6 mb-5 flex items-start gap-2.5">
                <span className="text-base select-none mt-0.5">🔒</span>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 font-sans">Verificação de Segurança Validada</h4>
                  <p className="text-[10px] text-blue-800 leading-relaxed font-light mt-0.5 font-sans">
                    Uma solicitação ativa para gravar uma nova credencial foi autorizada. Cadastre a sua nova senha administrativa preenchendo o formulário de segurança abaixo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
                <Lock size={13} className="text-blue-650 shrink-0" />
                <span>Conta: {simulatedEmailDetails.email}</span>
              </div>

              <form onSubmit={handleConfirmResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1.5 font-mono">Defina sua Nova Senha:</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      required
                      placeholder="Digite sua nova senha corporativa..."
                      value={manualNewPasswordInput}
                      onChange={(e) => setManualNewPasswordInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-light text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3.5 top-[9px] text-slate-400 hover:text-slate-650 border-none bg-transparent cursor-pointer p-0 select-none flex items-center shadow-none"
                    >
                      {showResetPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1.5 font-mono">Confirme sua Nova Senha:</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      required
                      placeholder="Confirme sua nova senha corporativa..."
                      value={manualConfirmPasswordInput}
                      onChange={(e) => setManualConfirmPasswordInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-light text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setSimulatedEmailDetails(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs py-2.5 rounded-xl font-medium border-none cursor-pointer transition-all font-sans"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isConfirmingReset || !manualNewPasswordInput || !manualConfirmPasswordInput || (!simulatedEmailDetails.token && !manualTokenInput)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2.5 rounded-xl font-medium border-none cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 font-sans"
                  >
                    {isConfirmingReset ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Salvando...
                      </>
                    ) : (
                      "Atualizar Senha"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] pt-24 pb-24 selection:bg-blue-105 selection:text-white font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb section */}
        <div className="flex items-center gap-2 text-xs font-light text-slate-400 mb-6 select-none font-sans">
          <Link to="/" className="hover:text-slate-900 transition-colors no-underline">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600 font-normal">Console Administrativo da boo</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar Navigation */}
          <div className={`transition-all duration-300 space-y-6 lg:sticky lg:top-24 ${
            isSidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'
          }`}>
            <div className={`bg-white border border-slate-200 rounded-2xl shadow-xxs transition-all duration-300 ${
              isSidebarCollapsed ? 'p-3' : 'p-5'
            }`}>
              <div className={`flex items-center justify-between mb-6 pb-4 border-b border-slate-100 ${
                isSidebarCollapsed ? 'flex-col gap-2' : ''
              }`}>
                {!isSidebarCollapsed ? (
                  <div className="truncate">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-blue-500 font-mono block">BOO INTEL PLATFORM</span>
                    <h1 className="text-lg font-semibold text-slate-900 tracking-tight mt-1 truncate">
                      Painel de Controle
                    </h1>
                  </div>
                ) : (
                  <div className="select-none text-center">
                    <span className="text-[11px] font-extrabold text-blue-500 font-mono block">BOO</span>
                  </div>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer flex items-center justify-center self-center"
                  title={isSidebarCollapsed ? "Expandir menu" : "Colapsar menu"}
                >
                  {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {/* Contatos (CRM Leads) */}
                <button
                  id="nav-lead-btn"
                  onClick={() => { setActiveTab('leads'); setSelectedLead(null); }}
                  className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center border-none relative ${
                    isSidebarCollapsed ? 'justify-center px-1' : 'justify-between px-3.5'
                  } ${
                    activeTab === 'leads' 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Contatos"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className={activeTab === 'leads' ? 'text-white' : 'text-slate-400'} />
                    {!isSidebarCollapsed && <span>Contatos</span>}
                  </div>
                  {!isSidebarCollapsed ? (
                    newLeadsCount > 0 && (
                      <span className="bg-[#21659F] text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold min-w-4.5 text-center leading-none">
                        {newLeadsCount}
                      </span>
                    )
                  ) : (
                    newLeadsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-blue-500 w-2 h-2 rounded-full ring-2 ring-white" />
                    )
                  )}
                </button>

                {/* Blog Trigger */}
                <div className="space-y-1 pt-1">
                  {!isSidebarCollapsed && (
                    <div className="px-3.5 py-1 text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                      Publicações
                    </div>
                  )}
                  
                  <button
                    id="nav-blog-btn"
                    onClick={() => { setActiveTab('list'); setEditingPostId(null); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center border-none ${
                      isSidebarCollapsed ? 'justify-center px-1' : 'gap-2.5 px-3.5'
                    } ${
                      (activeTab === 'list' || activeTab === 'editor' || activeTab === 'categories')
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Blog"
                  >
                    <FileText size={14} className={(activeTab === 'list' || activeTab === 'editor' || activeTab === 'categories') ? 'text-white' : 'text-slate-400'} />
                    {!isSidebarCollapsed && <span>Blog</span>}
                  </button>

                  {/* Sub-menu if Blog active */}
                  {!isSidebarCollapsed && (activeTab === 'list' || activeTab === 'editor' || activeTab === 'categories') && (
                    <div className="pl-4 border-l border-slate-150 ml-5 py-1 space-y-1">
                      <button
                        id="nav-blog-list"
                        onClick={() => { setActiveTab('list'); setEditingPostId(null); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer block border-none ${
                          activeTab === 'list' 
                            ? 'text-blue-600 font-medium bg-blue-50/40' 
                            : 'bg-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Todos os Artigos
                      </button>
                      <button
                        id="nav-blog-new"
                        onClick={handleAddNewClick}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer block border-none ${
                          activeTab === 'editor' && !editingPostId
                            ? 'text-blue-600 font-medium bg-blue-50/40' 
                            : 'bg-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Novo Artigo
                      </button>
                      <button
                        id="nav-blog-cat"
                        onClick={() => { setActiveTab('categories'); handleTestSupabaseConnection(); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer block border-none ${
                          activeTab === 'categories' 
                            ? 'text-blue-600 font-medium bg-blue-50/40' 
                            : 'bg-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Categorias & Sinc
                      </button>
                    </div>
                  )}
                </div>

                {/* Usuários */}
                <div className="space-y-1 pt-1">
                  {!isSidebarCollapsed && (
                    <div className="px-3.5 py-1 text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                      Acessos
                    </div>
                  )}
                  <button
                    id="nav-users-btn"
                    onClick={() => { setActiveTab('users'); loadAdminUsers(); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center border-none ${
                      isSidebarCollapsed ? 'justify-center px-1' : 'gap-2.5 px-3.5'
                    } ${
                      activeTab === 'users' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Usuários"
                  >
                    <Users size={14} className={activeTab === 'users' ? 'text-white' : 'text-slate-400'} />
                    {!isSidebarCollapsed && <span>Usuários</span>}
                  </button>
                </div>
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  id="nav-logout-btn"
                  onClick={handleLogout}
                  className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer bg-red-50 hover:bg-red-100 text-red-650 flex items-center justify-center border-none ${
                    isSidebarCollapsed ? 'px-1' : 'px-3.5 gap-2.5'
                  }`}
                  title="Sair do console administrativo"
                >
                  <LogOut size={13} />
                  {!isSidebarCollapsed && <span>Sair do Console</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content Area */}
          <div className={`transition-all duration-300 space-y-6 ${
            isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'
          }`}>
            
            {/* Status alerts */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border text-xs text-left flex items-center gap-3 shadow-xl max-w-sm ${
                    statusMessage.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                      : 'bg-red-50 border-red-150 text-red-750'
                  }`}
                >
                  {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <EyeOff size={16} />}
                  <span>{statusMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Switcher */}
            {isLoading && posts.length === 0 && leads.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl py-24 text-center text-slate-400 font-light flex flex-col items-center gap-3">
                <RefreshCw size={24} className="animate-spin text-[#21659F]" />
                <p className="text-sm">Carregando dados da plataforma...</p>
              </div>
            ) : (
              <div>
            
            {/* TAB 1: CLIENT LEADS CRM DATA HUB */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                
                {/* CRM KPIs cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xxs">
                    <div className="flex items-center gap-2 text-slate-400 uppercase tracking-wider text-[10px] font-mono mb-1">
                      <Clock size={12} className="text-[#46AAFF]" />
                      Total de Contatos Recebidos
                    </div>
                    <span className="text-3xl font-semibold text-slate-800">{totalLeadsCount}</span>
                    <span className="block text-[10.5px] text-slate-400 mt-1">Registrados em banco persistentemente</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xxs">
                    <div className="flex items-center gap-2 text-slate-400 uppercase tracking-wider text-[10px] font-mono mb-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      Aguardando Retorno (Novos)
                    </div>
                    <span className="text-3xl font-semibold text-blue-600">{newLeadsCount}</span>
                    <span className="block text-[10.5px] text-slate-400 mt-1">Leads novos não contatados</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xxs">
                    <div className="flex items-center gap-2 text-slate-400 uppercase tracking-wider text-[10px] font-mono mb-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Em Atendimento técnico
                    </div>
                    <span className="text-3xl font-semibold text-amber-500">{inProgressCount}</span>
                    <span className="block text-[10.5px] text-slate-400 mt-1">Negociações abertas ativas</span>
                  </div>
                </div>

                {/* Filters, search and export tools */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xxs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
                    
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Buscar contatos por nome, email ou mensagem..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all font-light"
                      />
                    </div>

                    {/* Status Dropdown Filter */}
                    <div className="relative min-w-[150px]">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white"
                      >
                        <option value="Todos">Status de Retorno</option>
                        <option value="Novo">Novo</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Contatado">Contatado</option>
                        <option value="Arquivado">Arquivado</option>
                      </select>
                    </div>

                  </div>

                  {/* Export button */}
                  <button
                    onClick={handleExportCSV}
                    className="bg-white border border-slate-200 hover:border-slate-350 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer justify-center"
                  >
                    <Download size={14} className="text-slate-500" />
                    Exportar (.CSV)
                  </button>
                </div>

                {/* Table and Selected Detail view */}
                {/* Table and Selected Detail view */}
                <div className="w-full items-start">
                  
                  {/* Leads Table element */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xxs">
                    {filteredLeads.length === 0 ? (
                      <div className="p-14 text-center text-slate-400 font-light text-xs">
                        Nenhum lead encontrado com os filtros atuais.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                              <th className="px-4.5 py-3.5">Nome / Email</th>
                              <th className="px-4.5 py-3.5">Origem (CTA)</th>
                              <th className="px-4.5 py-3.5">Mensagem</th>
                              <th className="px-4.5 py-3.5">Data de Envio</th>
                              <th className="px-4.5 py-3.5">Status</th>
                              <th className="px-4.5 py-3.5 text-right w-20">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredLeads.map((lead) => {
                              // Highlight row if selected
                              const isSelected = selectedLead?.id === lead.id;
                              
                              return (
                                <React.Fragment key={lead.id}>
                                  <tr 
                                    className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                                      isSelected ? 'bg-blue-50/50 hover:bg-blue-50/70' : ''
                                    }`}
                                    onClick={() => handleSelectLead(lead)}
                                  >
                                    {/* Name / Email */}
                                    <td className="px-4.5 py-4">
                                      <span className="font-semibold text-slate-850 block leading-tight truncate max-w-[150px]">{lead.name}</span>
                                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[150px]">{lead.email}</span>
                                    </td>
                                    
                                    {/* CTA origin page/anchor */}
                                    <td className="px-4.5 py-4 font-light text-slate-500 max-w-[140px] truncate">
                                      <span className="text-[10.5px] px-2 py-0.5 rounded-full border border-slate-100 bg-slate-50 text-slate-650 max-w-full block truncate">
                                        {lead.cta}
                                      </span>
                                    </td>

                                    {/* Message Preview */}
                                    <td className="px-4.5 py-4 font-light text-slate-500 max-w-[150px] truncate">
                                      {lead.message || <span className="italic text-slate-350">Sem mensagem enviada</span>}
                                    </td>

                                    {/* Format Send At Timestamp */}
                                    <td className="px-4.5 py-4 text-[10px] text-slate-400 font-mono">
                                      {new Date(lead.timestamp).toLocaleDateString('pt-BR')} <br />
                                      <span className="opacity-75">{new Date(lead.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>

                                    {/* Status Pills */}
                                    <td className="px-4.5 py-4">
                                      {lead.status === 'Novo' || !lead.status ? (
                                        <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                          Novo
                                        </span>
                                      ) : lead.status === 'Em Andamento' ? (
                                        <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full text-[9px] font-semibold">
                                          Em Atendimento
                                        </span>
                                      ) : lead.status === 'Contatado' ? (
                                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-150 px-2 py-0.5 rounded-full text-[9px] font-semibold">
                                          Contatado
                                        </span>
                                      ) : (
                                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[9px] font-light">
                                          Arquivado
                                        </span>
                                      )}
                                    </td>

                                    {/* Actions inline */}
                                    <td className="px-4.5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => handleDeleteLead(lead.id, lead.name)}
                                        className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-650 transition-colors cursor-pointer border-none bg-transparent"
                                        title="Excluir Lead permanentemente"
                                      >
                                        <Trash2 size={13.5} />
                                      </button>
                                    </td>
                                  </tr>
                                  
                                  {/* Expanded Details Row */}
                                  {isSelected && (
                                    <tr className="bg-slate-50/50">
                                      <td colSpan={6} className="p-0 border-b border-slate-200">
                                        <motion.div 
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          className="overflow-hidden border-t border-slate-150"
                                        >
                                          <div className="p-6 md:p-8">
                                            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm text-left grid grid-cols-1 md:grid-cols-2 gap-8">
                                              
                                              {/* Left Column: Info */}
                                              <div className="space-y-6">
                                                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                                                  <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono">Ficha do Contato</h3>
                                                  <span className="text-[10px] text-slate-400 font-mono">ID: {selectedLead.id}</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-6">
                                                  <div>
                                                    <span className="block text-[10px] text-slate-450 uppercase font-mono mb-1">Nome Completo</span>
                                                    <span className="text-sm font-semibold text-slate-800">{selectedLead.name}</span>
                                                  </div>
                                                  <div>
                                                    <span className="block text-[10px] text-slate-450 uppercase font-mono mb-1">Endereço de E-mail</span>
                                                    <span className="text-sm font-normal text-[#21659F] break-all">{selectedLead.email}</span>
                                                  </div>
                                                </div>

                                                <div>
                                                  <span className="block text-[10px] text-slate-450 uppercase font-mono mb-1">Página / Contexto de Origem</span>
                                                  <span className="text-sm font-light text-slate-600 block italic">"{selectedLead.cta}"</span>
                                                </div>

                                                <div>
                                                  <span className="block text-[10px] text-slate-450 uppercase font-mono mb-2">Mensagem do Cliente</span>
                                                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-sm font-light text-slate-600 max-h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                                                    {selectedLead.message || <span className="italic text-slate-350">Sem mensagem preenchida</span>}
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Right Column: Actions */}
                                              <div className="space-y-5">
                                                <div className="border-b border-slate-100 pb-4">
                                                  <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono">Ações de Atendimento</h3>
                                                </div>

                                                <div>
                                                  <label className="block text-[10px] text-slate-450 uppercase font-mono mb-2">Status de Atendimento comercial</label>
                                                  <select
                                                    value={leadStatus}
                                                    onChange={(e) => setLeadStatus(e.target.value as any)}
                                                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-sm text-slate-755 focus:outline-none focus:ring-1 focus:ring-blue-300"
                                                  >
                                                    <option value="Novo">Novo (Sem contato)</option>
                                                    <option value="Em Andamento">Em Andamento</option>
                                                    <option value="Contatado">Contatado</option>
                                                    <option value="Arquivado">Arquivado (Fechado)</option>
                                                  </select>
                                                </div>

                                                <div>
                                                  <label className="block text-[10px] text-slate-450 uppercase font-mono mb-2">Notas Administrativas (Privado)</label>
                                                  <textarea
                                                    rows={5}
                                                    placeholder="Adicione anotações internas aqui (ex: Reunião agendada para 03/06...)"
                                                    value={leadNotes}
                                                    onChange={(e) => setLeadNotes(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-205 rounded-xl p-4 text-sm font-light text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none"
                                                  />
                                                </div>

                                                <div className="flex gap-3 pt-3">
                                                  <button
                                                    onClick={() => {
                                                      const subject = encodeURIComponent('Suporte Técnico / Comercial boo');
                                                      const body = encodeURIComponent(`Olá ${selectedLead.name},\n\nAqui é da equipe de atendimento da boo. Recebemos seu interesse em "${selectedLead.cta}".`);
                                                      window.open(`mailto:${selectedLead.email}?subject=${subject}&body=${body}`);
                                                    }}
                                                    className="flex-1 bg-white border border-slate-205 hover:border-slate-350 text-slate-700 py-3 rounded-xl text-sm font-normal transition-colors cursor-pointer text-center"
                                                  >
                                                    Enviar Email 📬
                                                  </button>
                                                  <button
                                                    onClick={handleUpdateLead}
                                                    className="flex-1 bg-slate-900 hover:bg-slate-950 text-white py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                                                  >
                                                    <Save size={14} /> Salvar Ficha
                                                  </button>
                                                </div>
                                              </div>

                                            </div>
                                          </div>
                                        </motion.div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: ARTICLES TAB TABLE LIST */}
            {activeTab === 'list' && (
              <div className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-xs">
                {posts.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-light text-xs">
                    Nenhum artigo disponível. Clique em "Novo Artigo" para lançar sua primeira publicação.
                  </div>
                ) : (
                  <div className="overflow-x-auto text-left">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                          <th className="px-3 py-3">Artigo</th>
                          <th className="px-3 py-3">Categoria</th>
                          <th className="px-3 py-3">Publicado em</th>
                          <th className="px-3 py-3">Destaque?</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {posts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-3 max-w-[200px] lg:max-w-[280px]">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-205">
                                  <img 
                                    src={post.coverImage} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="truncate">
                                  <span className="font-semibold text-slate-800 truncate block leading-snug">{post.title}</span>
                                  <span className="text-[10px] font-light text-slate-400 font-mono truncate block">ID: {post.id} · Slug: {post.slug}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-[10.5px] font-normal px-2 py-0.5 rounded-full border bg-slate-50 border-slate-150 text-slate-600">
                                {post.category}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-slate-400 font-mono">
                              {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-3 py-3 text-slate-500">
                              {post.featured ? (
                                <span className="text-amber-500 bg-amber-50 border border-amber-150 px-2 py-0.5 rounded-md text-[9px] font-bold">
                                  Sim
                                </span>
                              ) : (
                                <span className="text-slate-350 text-[10px] font-light">-</span>
                              )}
                            </td>
                            <td className="px-3 py-3">
                              <button
                                onClick={() => handleTogglePublished(post)}
                                className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-wide flex items-center gap-1 cursor-pointer border hover:bg-slate-50 transition-all ${
                                  post.published 
                                    ? 'bg-emerald-50 border-emerald-150 text-emerald-600' 
                                    : 'bg-red-50 border-red-150 text-red-650'
                                }`}
                              >
                                {post.published ? (
                                  <>
                                    <Globe size={10} /> Ativo
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={10} /> Rascunho
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-3 py-3 text-right w-24">
                              <div className="flex gap-1.5 justify-end">
                                <Link 
                                  to={`/blog/${post.slug}`} 
                                  target="_blank"
                                  className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-850 transition-colors"
                                  title="Ver Artigo"
                                >
                                  <Eye size={14.5} />
                                </Link>
                                <button
                                  onClick={() => handleEditClick(post)}
                                  className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-[#21659F] transition-colors border-none bg-transparent"
                                  title="Editar Artigo"
                                >
                                  <Edit3 size={14.5} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(post.id, post.title)}
                                  className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors border-none bg-transparent"
                                  title="Excluir Artigo"
                                >
                                  <Trash2 size={14.5} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ARTICLE WRITING/EDITING FORM PANEL */}
            {activeTab === 'editor' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
                
                {/* Writing Form Side */}
                <form onSubmit={handleSaveForm} className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 md:p-7 shadow-xxs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 size={15} className="text-blue-500" />
                      {editingPostId ? 'Editar artigo cadastrado' : 'Escrever Novo Artigo'}
                    </h3>
                    {editingPostId && (
                      <span className="text-[10px] px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-blue-600 font-mono">
                        Modo Edição
                      </span>
                    )}
                  </div>

                  {/* Title input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-750 mb-1.5">Título do Artigo *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Como Conectar Dados de ERP Sem Complicações"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-light text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white"
                    />
                  </div>

                  {/* Category and Author */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-750 mb-1.5">Categoria *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-light text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-750 mb-1.5">Autor Principal *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Thomas Pires"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-light text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-medium text-slate-750 mb-1.5">Resumo Breve (Exibido no card) *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Resumo introdutório que aparecerá nos cards de artigos do blog..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-light text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white resize-y"
                    />
                  </div>

                  {/* Body Content Markdown Editor */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-medium text-slate-750">Conteúdo do Artigo (Markdown) *</label>
                      <span className="text-[9px] font-mono text-slate-400">Suporta formatação Heading (##, ###)</span>
                    </div>
                    <textarea 
                      required
                      rows={14}
                      placeholder="Escreva o conteúdo do artigo usando Markdown para cabeçalhos, marcadores e parágrafos normais..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 placeholder-gray-450 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white resize-y leading-relaxed"
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                    <span className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Image size={14} className="text-slate-500" />
                      Imagem de Capa do Artigo
                    </span>

                    <div className="space-y-2">
                      <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Presets boo recomendados</span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {unsplashPresets.map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setCoverImage(preset.url)}
                            className={`group rounded-lg overflow-hidden shrink-0 aspect-[16/10] bg-slate-200 relative border-2 cursor-pointer transition-all ${
                              coverImage === preset.url ? 'border-blue-500 scale-95 shadow-sm' : 'border-transparent opacity-85'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            {coverImage === preset.url && (
                              <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                <span className="bg-blue-600 text-white rounded-full p-0.5">
                                  <Check size={8} className="stroke-[3]" />
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                      <div className="flex-1 w-full">
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">Ou informe uma URL externa:</span>
                        <input 
                          type="url"
                          placeholder="https://images.unsplash.com/your-custom-image-path..."
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-light text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">Carregar do dispositivo:</span>
                        <label className="bg-white border border-slate-200 hover:border-slate-350 px-4 py-2 rounded-xl text-xs text-slate-705 font-light cursor-pointer flex items-center gap-1.5 justify-center">
                          <Upload size={13} /> Escolher arquivo
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SEO METADATA */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <span className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Globe size={14} className="text-slate-500" />
                      Indexação e Metatags SEO
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-1">Meta Title Especializado</label>
                        <input 
                          type="text"
                          placeholder="Recomendado até 60 caracteres"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          className="w-full bg-white border border-slate-220 rounded-xl px-3 py-2 text-[11px] font-light text-slate-700 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-1">Meta Description do artigo</label>
                        <input 
                          type="text"
                          placeholder="Recomendado até 155 caracteres"
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          className="w-full bg-white border border-slate-220 rounded-xl px-3 py-2 text-[11px] font-light text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Checkboxes indicators */}
                  <div className="flex flex-wrap gap-5 items-center justify-between border-t border-slate-100 pt-5 text-xs">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-slate-650 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-300"
                        />
                        Artigo destaque no Blog
                      </label>

                      <label className="flex items-center gap-2 text-slate-650 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={published}
                          onChange={(e) => setPublished(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-300"
                        />
                        Publicar imediatamente
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('list'); setEditingPostId(null); }}
                        className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs font-normal transition-colors border-none cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border-none"
                      >
                        <Save size={14} /> Salvar Artigo
                      </button>
                    </div>
                  </div>
                </form>

                {/* Live Preview Side */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xxs">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1.5 mb-4 border-b border-slate-50 pb-2 font-mono">
                      <Eye size={13} className="text-blue-500" />
                      Amostra de Card (Em tempo real)
                    </span>

                    <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50">
                      <div className="aspect-[16/9] w-full relative bg-slate-205">
                        {coverImage && (
                          <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        )}
                        <span className="absolute top-2.5 left-2.5 text-[8.5px] font-normal px-2 py-0.5 rounded-full bg-blue-50/90 text-blue-600 border border-blue-105 shadow-xxs">
                          {category}
                        </span>
                      </div>
                      <div className="p-4 bg-white text-left">
                        <span className="text-[9px] font-mono text-slate-350 block mb-1">Publicado por {author}</span>
                        <h5 className="text-[14px] font-semibold text-slate-900 line-clamp-1 mb-1.5">
                          {title || 'Sem título rascunhado'}
                        </h5>
                        <p className="text-[11px] font-light text-slate-450 line-clamp-2 leading-relaxed">
                          {excerpt || 'Defina um breve resumo deste artigo nas entradas...'}
                        </p>
                      </div>
                    </div>

                    <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 max-h-72 overflow-y-auto mt-4 text-left">
                      <h6 className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 font-mono">Preview de Texto:</h6>
                      <div className="prose prose-xs">
                        {content ? (
                          content.split('\n').filter(Boolean).slice(0, 4).map((pParagraph, pIdx) => (
                            <p key={pIdx} className="text-slate-500 text-[11px] leading-relaxed mb-2 break-all">
                              {pParagraph}
                            </p>
                          ))
                        ) : (
                          <span className="text-slate-350 text-[10.5px] italic">Escreva some conteúdo para ver as primeiras linhas...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: BLOG CATEGORIES & SUPABASE SYNC DIAGNOSTICS */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Supabase integration diagnostics card (Col 7) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xxs space-y-6 text-left">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 font-sans">
                      <Database size={15} className="text-[#46AAFF]" />
                      Sincronização Cloud (Supabase)
                    </h3>
                    <p className="text-[10px] font-light text-slate-405 mt-1 leading-relaxed">
                      Painel de status da integração em nuvem. Use este console para validar a conectividade e garantir que as tabelas de banco de dados SQL estão geradas perfeitamente.
                    </p>
                  </div>

                  {/* Diagnostic details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-dotted border-slate-200 bg-slate-50/50">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">Status do Banco de Dados</span>
                        <div className="flex items-center gap-2 mt-1">
                          {supabaseTestStatus?.success ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xs font-medium text-emerald-700">Supabase Nuvem Ativo</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="text-xs font-medium text-amber-700">
                                {supabaseTestStatus?.status?.isConfigured ? 'Falha nas Tabelas/Acesso' : 'Modo de Arquivo Local'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleTestSupabaseConnection}
                        disabled={isTestingSupabase}
                        className="py-1.5 px-3 bg-slate-900 hover:bg-slate-950 text-white text-[10.5px] rounded-lg cursor-pointer transition-all flex items-center gap-1.5 font-medium shadow-xxs disabled:opacity-75 animate"
                      >
                        {isTestingSupabase ? (
                          <>
                            <RefreshCw size={11} className="animate-spin" /> Verificando...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={11} /> Testar Conexão
                          </>
                        )}
                      </button>
                    </div>

                    {/* Connection details block */}
                    {supabaseTestStatus ? (
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3 font-mono text-[10.5px] text-slate-600">
                        <div className="flex justify-between border-b border-slate-100 pb-1.5 items-center gap-2">
                          <span>API Endpoint:</span>
                          <span className="text-slate-800 break-all select-all font-semibold max-w-[200px] text-right truncate">
                            {supabaseTestStatus.status?.url}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span>Chave API Configurada:</span>
                          <span className="text-slate-800 font-semibold flex items-center gap-1">
                            {supabaseTestStatus.status?.keySnippet}
                          </span>
                        </div>
                        
                        <div className="space-y-1.5 pt-1">
                          <span className="block text-[9.5px] text-slate-400 uppercase tracking-wider font-semibold font-sans">Verificação de Tabelas:</span>
                          
                          <div className="flex justify-between items-center bg-white border border-slate-150/60 p-2 rounded-lg">
                            <span className="font-sans font-medium text-slate-700 text-xs">Tabela 1: Leads (Leads de Contato)</span>
                            {supabaseTestStatus.status?.tablesStatus?.leads?.accessible ? (
                              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-sans font-medium flex items-center gap-1">
                                <Check size={11} className="stroke-[3]" /> Criada & Ativa
                              </span>
                            ) : (
                              <span className="text-[11px] text-red-650 bg-red-50 px-2 py-0.5 rounded-full font-sans font-medium">
                                Inexistente/Erro
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center bg-white border border-slate-150/60 p-2 rounded-lg">
                            <span className="font-sans font-medium text-slate-700 text-xs">Tabela 2: Articles (Postagens)</span>
                            {supabaseTestStatus.status?.tablesStatus?.blog_posts?.accessible ? (
                              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-sans font-medium flex items-center gap-1">
                                <Check size={11} className="stroke-[3]" /> Criada & Ativa
                              </span>
                            ) : (
                              <span className="text-[11px] text-red-650 bg-red-50 px-2 py-0.5 rounded-full font-sans font-medium">
                                Inexistente/Erro
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center bg-white border border-slate-150/60 p-2 rounded-lg">
                            <span className="font-sans font-medium text-slate-700 text-xs">Tabela 3: Administradores (Controle de Acesso)</span>
                            {supabaseTestStatus.status?.tablesStatus?.admin_users?.accessible ? (
                              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-sans font-medium flex items-center gap-1">
                                <Check size={11} className="stroke-[3]" /> Criada & Ativa
                              </span>
                            ) : (
                              <span className="text-[11px] text-red-650 bg-red-50 px-2 py-0.5 rounded-full font-sans font-medium">
                                Inexistente/Erro
                              </span>
                            )}
                          </div>
                        </div>

                        {supabaseTestStatus.success ? (
                          <div className="text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg font-sans text-xs leading-relaxed mt-1">
                            🚀 <strong>Tudo operacional!</strong> O banco de dados em nuvem foi ativado e está perfeitamente sincronizado com as ações de salvamento, edição, remoção e captação do site.
                          </div>
                        ) : (
                          <div className="text-amber-800 bg-amber-50 border border-amber-100 p-3 rounded-lg font-sans text-xs leading-relaxed mt-1">
                            💡 <strong>Atenção ao SQL:</strong> Se alguma tabela acima estiver listada como inexistente, certifique-se de executar a query de criação de tabelas e desativação das RLS no painel SQL Editor do Supabase. Se o erro persistir, o sistema prosseguirá em modo local para segurança.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-center text-xs font-light text-slate-450 leading-relaxed font-sans">
                        Clique em <strong>"Testar Conexão"</strong> acima para verificar a integração com seu banco de dados Supabase e inspecionar a acessibilidade das tabelas.
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories structure (Col 5) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xxs space-y-6 text-left">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 font-sans">
                      <FolderPlus size={15} className="text-blue-500" />
                      Taxonomia de Categorias
                    </h3>
                    <p className="text-[10px] font-light text-slate-405 mt-1 leading-relaxed">
                      Gerencie as categorias de postagens do Blog.
                    </p>
                  </div>

                  <form onSubmit={handleCategoryAdd} className="flex gap-2">
                    <input 
                      type="text"
                      required
                      placeholder="Nome da categoria..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-light text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-950 text-white text-xs px-4 rounded-xl flex items-center gap-1.5 cursor-pointer border-none font-medium h-9"
                    >
                      <Plus size={14} /> Adicionar
                    </button>
                  </form>

                  <div className="space-y-2">
                    <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">Categorias Cadastradas</span>
                    <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/20 max-h-64 overflow-y-auto">
                      {categories.map((cat) => (
                        <div key={cat} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/50 transition-colors">
                          <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#46AAFF]" />
                            {cat}
                          </span>
                          
                          <button
                            onClick={() => handleCategoryDelete(cat)}
                            className="text-slate-405 hover:text-red-650 p-1.5 hover:bg-red-50 rounded transition-all cursor-pointer border-none bg-transparent"
                            title="Excluir Categoria"
                          >
                            <Trash2 size={13.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Access Control user configuration (activeTab === 'users') */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
                
                {/* Lateral panel for adding a user (Col 5) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xxs space-y-6 text-left">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 font-sans">
                      <UserPlus size={15} className="text-blue-500" />
                      Conceder Novo Acesso
                    </h3>
                    <p className="text-[10px] font-light text-slate-405 mt-1 leading-relaxed font-sans">
                      Cadastre o e-mail corporativo e a senha para habilitar o acesso ao console administrativo da boo.
                    </p>
                  </div>

                  <form onSubmit={handleCreateAdminUser} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 mb-1.5 font-mono uppercase tracking-wider">Email do Colaborador:</label>
                      <input 
                        type="email"
                        required
                        placeholder="Ex: contato@boolabs.com.br"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-light text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 mb-1.5 font-mono uppercase tracking-wider">Senha de Acesso:</label>
                      <input 
                        type="text"
                        required
                        placeholder="Crie uma senha segura para o usuário..."
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-light text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAddingUser}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer border-none font-medium transition-all disabled:opacity-75 font-sans"
                    >
                      {isAddingUser ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" /> Concedendo...
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Conceder Acesso
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* List of accounts panel (Col 7) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xxs text-left">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 font-sans">
                      <Users size={15} className="text-blue-500" />
                      Usuários com Acesso Ativo
                    </h3>
                    <p className="text-[10px] font-light text-slate-405 mt-1 leading-relaxed font-sans">
                      Gerencie e visualize quem possui permissão de leitura, edição e exclusão de marcas, leads ou posts.
                    </p>
                  </div>

                  {isLoadingUsers ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                      <RefreshCw size={20} className="animate-spin text-[#21659F]" />
                      <span className="text-xs font-light">Carregando acessos ativos...</span>
                    </div>
                  ) : adminUsers.length === 0 ? (
                    <div className="py-12 text-center text-xs font-light text-slate-400">
                      Nenhum administrador cadastrado. Isto é inesperado.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-3">
                      {adminUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl flex items-center justify-between gap-4 hover:border-slate-300 transition-colors font-sans"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-850 block">{user.email}</span>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200/60 px-1.5 py-0.5 rounded select-none">
                                Senha: ••••••••
                              </span>
                              
                              <button
                                onClick={() => handleResetUserPassword(user.email)}
                                disabled={isResettingUser === user.email}
                                className="text-[10px] font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
                                title="Enviar email de redefinição de senha"
                              >
                                {isResettingUser === user.email ? (
                                  <>
                                    <RefreshCw size={11} className="animate-spin" />
                                    <span>Solicitando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Mail size={11.5} className="text-blue-500" />
                                    <span>Redefinir Senha</span>
                                  </>
                                )}
                              </button>

                              {user.createdAt && (
                                <span className="text-[9px] text-slate-400 border-l border-slate-200 pl-2">
                                  Desde: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteAdminUser(user.id, user.email)}
                            className="text-slate-405 hover:text-red-650 p-2 hover:bg-red-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                            title="Remover Acesso"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

            </div>
          </div>

        {/* Floating Reset Modal inside the authenticated dashboard if active */}
        {simulatedEmailDetails && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full text-left relative overflow-hidden font-sans"
            >
              {/* Administrative Shield Banner */}
              <div className="bg-blue-50 border-b border-blue-100 p-4 -mx-6 -mt-6 mb-5 flex items-start gap-2.5">
                <span className="text-base select-none mt-0.5">🔑</span>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 font-sans">Redefinição Administrativa de Senha</h4>
                  <p className="text-[10px] text-blue-800 leading-relaxed font-light mt-0.5 font-sans">
                    Você possui privilégios de administrador de rede para alterar diretamente a credencial deste colaborador. A nova senha será salva de forma segura e entrará em vigor imediatamente.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
                <Users size={13} className="text-blue-650 shrink-0" />
                <span>Colaborador: {simulatedEmailDetails.email}</span>
              </div>

              {/* Security Authorization Code Box */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3.5 mb-4 font-mono text-[10px] text-slate-600 space-y-1.5 leading-relaxed">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">Protocolo de Alteração:</span>
                  <span className="text-blue-650 font-bold font-mono text-[11px] select-all bg-white border border-slate-200 rounded px-2 py-0.5 uppercase shadow-xxs">{simulatedEmailDetails.token}</span>
                </div>
                <div className="h-px bg-slate-200/60 my-1.5" />
                <p className="text-slate-500 text-[10px] font-sans font-light">
                  A gravação desta chave de segurança atualizará o status da conta do usuário no banco de dados ativo.
                </p>
              </div>

              <form onSubmit={handleConfirmResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-700 mb-1.5 font-mono">Digite a Nova Senha do Usuário:</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Grave a nova senha corporativa..."
                    value={manualNewPasswordInput}
                    onChange={(e) => setManualNewPasswordInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-light text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div className="flex gap-2.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setSimulatedEmailDetails(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs py-2.5 rounded-xl font-medium border-none cursor-pointer transition-all font-sans"
                  >
                    Mantenha Atual
                  </button>
                  <button
                    type="submit"
                    disabled={isConfirmingReset || !manualNewPasswordInput}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2.5 rounded-xl font-medium border-none cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 font-sans"
                  >
                    {isConfirmingReset ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Atualizando...
                      </>
                    ) : (
                      "Confirmar Alteração"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}

