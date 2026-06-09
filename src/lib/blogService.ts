import { BlogPost } from '../types/blog';
import { AdminUser } from '../types/adminUser';
import { defaultPosts } from './defaultPosts';

const API_BASE_URL = '/api/blog';

// Slugify helper
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-'); // replace multiple - with single -
}

// Calculate reading time based on 200 words per minute
export function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}

// Memory / LocalStorage backup key
const STORAGE_KEY = 'boo_blog_posts';

function getLocalBackup(): BlogPost[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading localStorage backup', e);
  }
  return defaultPosts;
}

function saveLocalBackup(posts: BlogPost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Error writing localStorage backup', e);
  }
}

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = sessionStorage.getItem('boo_admin_token');
  const headers: Record<string, string> = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const blogService = {
  // 1. Get all posts (or filter/search)
  async getPosts(includeUnpublished = false): Promise<BlogPost[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/posts`);
      if (res.ok) {
        let serverPosts: BlogPost[] = await res.json();
        // Update local backup
        saveLocalBackup(serverPosts);
        return includeUnpublished ? serverPosts : serverPosts.filter(p => p.published);
      }
    } catch (err) {
      console.warn('API error fetching posts, falling back to local storage:', err);
    }
    
    // Fallback to local backup
    const posts = getLocalBackup();
    return includeUnpublished ? posts : posts.filter(p => p.published);
  },

  // 2. Get single post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/by-slug/${slug}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`API error fetching post by slug (${slug}), falling back:`, err);
    }

    const posts = getLocalBackup();
    return posts.find(p => p.slug === slug && p.published) || posts.find(p => p.slug === slug) || null;
  },

  // 3. Get single post by id
  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`API error fetching post by ID (${id}), falling back:`, err);
    }

    const posts = getLocalBackup();
    return posts.find(p => p.id === id) || null;
  },

  // 4. Create post
  async createPost(postData: Omit<BlogPost, 'id' | 'slug' | 'publishedAt' | 'readingTime'> & { id?: string }): Promise<BlogPost> {
    const slug = slugify(postData.title);
    const readingTime = estimateReadingTime(postData.content);
    const publishedAt = new Date().toISOString();
    const id = postData.id || Math.random().toString(36).substring(2, 9);

    const newPost: BlogPost = {
      ...postData,
      id,
      slug,
      publishedAt,
      readingTime,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        const serverPost = await res.json();
        // Sync to local backup
        const local = getLocalBackup();
        local.unshift(serverPost);
        saveLocalBackup(local);
        return serverPost;
      } else {
        throw new Error(`API error creating post: ${res.status}`);
      }
    } catch (err: any) {
      if (err.message.startsWith('API error')) throw err;
      console.error('API error creating post, fallback saving to localStorage:', err);
    }

    // Fallback logic
    const local = getLocalBackup();
    local.unshift(newPost);
    saveLocalBackup(local);
    return newPost;
  },

  // 5. Update post
  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    // If title has changed, optionally update slug
    let updates = { ...postData };
    if (postData.title) {
      updates.slug = slugify(postData.title);
    }
    if (postData.content) {
      updates.readingTime = estimateReadingTime(postData.content);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const serverPost = await res.json();
        // Sync
        const local = getLocalBackup();
        const idx = local.findIndex(p => p.id === id);
        if (idx !== -1) {
          local[idx] = serverPost;
          saveLocalBackup(local);
        }
        return serverPost;
      } else {
        throw new Error(`API error updating post: ${res.status}`);
      }
    } catch (err: any) {
      if (err.message.startsWith('API error')) throw err;
      console.error(`API error updating post (${id}), fallback update to localStorage:`, err);
    }

    // Fallback logic
    const local = getLocalBackup();
    const idx = local.findIndex(p => p.id === id);
    if (idx !== -1) {
      const updatedPost = { ...local[idx], ...updates } as BlogPost;
      local[idx] = updatedPost;
      saveLocalBackup(local);
      return updatedPost;
    }
    throw new Error(`Post with id ${id} not found in local backup.`);
  },

  // 6. Delete post
  async deletePost(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        // Sync
        const local = getLocalBackup();
        const filtered = local.filter(p => p.id !== id);
        saveLocalBackup(filtered);
        return true;
      } else {
         throw new Error(`API error deleting post: ${res.status}`);
      }
    } catch (err: any) {
      if (err.message.startsWith('API error')) throw err;
      console.error(`API error deleting post (${id}), fallback delete in localStorage:`, err);
    }

    // Fallback logic
    const local = getLocalBackup();
    const filtered = local.filter(p => p.id !== id);
    saveLocalBackup(filtered);
    return true;
  },

  // Get active categories
  getCategories(): string[] {
    const posts = getLocalBackup();
    const categoriesSet = new Set(posts.map(p => p.category));
    return Array.from(categoriesSet).filter(Boolean);
  },

  // Authentication services
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('boo_admin_token', data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Erro ao autenticar.' };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Conexão com servidor indisponível.' };
    }
  },

  logout() {
    sessionStorage.removeItem('boo_admin_token');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = sessionStorage.getItem('boo_admin_token');
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return !!data.valid;
    } catch {
      return false;
    }
  },

  // Admin user management services
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const res = await fetch('/api/admin-users', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
    return [];
  },

  async createAdminUser(email: string, password: string): Promise<AdminUser> {
    try {
      const res = await fetch('/api/admin-users', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Erro ao criar usuário.');
      }
    } catch (err: any) {
      console.error('Error creating admin user:', err);
      throw err;
    }
  },

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const res = await fetch(`/api/admin-users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Erro ao atualizar usuário.');
      }
    } catch (err: any) {
      console.error('Error updating admin user:', err);
      throw err;
    }
  },

  async deleteAdminUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin-users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error('Error deleting admin user:', err);
    }
    return false;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; simulatedToken?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin-users/reset-password', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message, simulatedToken: data.simulatedToken };
      } else {
        return { success: false, message: '', error: data.error || 'Erro ao redefinir.' };
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      return { success: false, message: '', error: 'Não foi possível conectar ao servidor.' };
    }
  },

  async requestPublicPasswordReset(email: string): Promise<{ success: boolean; message: string; simulatedToken?: string; error?: string }> {
    try {
      const res = await fetch('/api/blog/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message, simulatedToken: data.simulatedToken };
      } else {
        return { success: false, message: '', error: data.error || 'Erro ao solicitar.' };
      }
    } catch (err) {
      console.error('Error requesting public password reset:', err);
      return { success: false, message: '', error: 'Não foi possível conectar ao servidor.' };
    }
  },

  async confirmPasswordReset(token: string, newPassword: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const res = await fetch('/api/blog/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: '', error: data.error || 'Erro ao confirmar nova senha.' };
      }
    } catch (err) {
      console.error('Error confirming password reset:', err);
      return { success: false, message: '', error: 'Não foi possível conectar ao servidor.' };
    }
  }
};
