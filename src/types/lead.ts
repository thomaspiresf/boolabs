export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  cta: string;
  timestamp: string;
  status: 'Novo' | 'Contatado' | 'Em Andamento' | 'Arquivado';
  notes?: string;
}
