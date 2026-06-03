import { Lead } from '../types/lead';

const API_BASE_URL = '/api/leads';

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = sessionStorage.getItem('boo_admin_token');
  const headers: Record<string, string> = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const leadService = {
  // 1. Get all leads (Protected)
  async getLeads(): Promise<Lead[]> {
    try {
      const res = await fetch(API_BASE_URL, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const serverLeads = await res.json();
        // Sync local storage backup
        localStorage.setItem('boo_leads', JSON.stringify(serverLeads));
        return serverLeads;
      }
    } catch (err) {
      console.warn('API error fetching leads, falling back to local storage:', err);
    }

    // Fallback
    try {
      return JSON.parse(localStorage.getItem('boo_leads') || '[]');
    } catch {
      return [];
    }
  },

  // 2. Update lead status or notes (Protected)
  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        // Sync local storage
        const currentLocal = JSON.parse(localStorage.getItem('boo_leads') || '[]');
        const idx = currentLocal.findIndex((l: any) => l.id === id);
        if (idx !== -1) {
          currentLocal[idx] = { ...currentLocal[idx], ...updated };
          localStorage.setItem('boo_leads', JSON.stringify(currentLocal));
        }
        return updated;
      }
    } catch (err) {
      console.error('API error updating lead, using local fallback:', err);
    }

    // Fallback logic for localStorage
    const currentLocal = JSON.parse(localStorage.getItem('boo_leads') || '[]');
    const idx = currentLocal.findIndex((l: any) => l.id === id);
    if (idx !== -1) {
      const updated = { ...currentLocal[idx], ...updates };
      currentLocal[idx] = updated;
      localStorage.setItem('boo_leads', JSON.stringify(currentLocal));
      return updated;
    }
    throw new Error('Lead context not found locally.');
  },

  // 3. Delete lead (Protected)
  async deleteLead(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const currentLocal = JSON.parse(localStorage.getItem('boo_leads') || '[]');
        const filtered = currentLocal.filter((l: any) => l.id !== id);
        localStorage.setItem('boo_leads', JSON.stringify(filtered));
        return true;
      }
    } catch (err) {
      console.error('API error deleting lead, using local fallback:', err);
    }

    // Fallback logic
    const currentLocal = JSON.parse(localStorage.getItem('boo_leads') || '[]');
    const filtered = currentLocal.filter((l: any) => l.id !== id);
    localStorage.setItem('boo_leads', JSON.stringify(filtered));
    return true;
  }
};
