import supabase from '../config/database';
import { Contact, PaginationParams, FilterParams } from '../types';
import axios from 'axios';

const AI_REACHER_BACKEND = process.env.AI_REACHER_BACKEND_URL || 'https://ai-reacher-backend-production.up.railway.app';

export class ContactsService {
  async getAll(pagination: PaginationParams, filters?: FilterParams) {
    const { page, limit, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('ai_reacher_contacts').select('*', { count: 'exact' });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'string' && key === 'search') {
            query = query.or(`nombre.ilike.%${value}%,empresa.ilike.%${value}%,cargo.ilike.%${value}%`);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    return { data: data || [], total: count || 0 };
  }

  async getById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('ai_reacher_contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  async create(contact: Contact): Promise<Contact> {
    const { data, error } = await supabase
      .from('ai_reacher_contacts')
      .insert([contact])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create contact: ${error?.message}`);
    }

    return data;
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase
      .from('ai_reacher_contacts')
      .update(contact)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update contact: ${error?.message}`);
    }

    return data;
  }

  async searchPreview(searchParams: any): Promise<any> {
    try {
      const response = await axios.post(`${AI_REACHER_BACKEND}/api/search/preview`, searchParams);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to search contacts: ${error.message}`);
    }
  }

  async revealContact(contactId: string): Promise<any> {
    try {
      const response = await axios.post(`${AI_REACHER_BACKEND}/api/search/reveal`, { contactId });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to reveal contact: ${error.message}`);
    }
  }
}

export default new ContactsService();
