import supabase from '../config/database';
import { Deal, PaginationParams, FilterParams } from '../types';

export class DealsService {
  async getAll(pagination: PaginationParams, filters?: FilterParams) {
    const { page, limit, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('fe_deals').select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    // Ordenamiento y paginación
    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to fetch deals: ${error.message}`);
    }

    return { data: data || [], total: count || 0 };
  }

  async getById(id: string): Promise<Deal | null> {
    const { data, error } = await supabase
      .from('fe_deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  async create(deal: Deal, userId: string): Promise<Deal> {
    const newDeal = {
      ...deal,
      owner_id: userId,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('fe_deals')
      .insert([newDeal])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create deal: ${error?.message}`);
    }

    return data;
  }

  async update(id: string, deal: Partial<Deal>): Promise<Deal> {
    const { data, error } = await supabase
      .from('fe_deals')
      .update(deal)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update deal: ${error?.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('fe_deals')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete deal: ${error.message}`);
    }

    return true;
  }

  async getStats(ownerId?: string) {
    let query = supabase.from('fe_deals').select('stage, amount');

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query;

    if (error || !data) {
      throw new Error('Failed to fetch stats');
    }

    // Calcular estadísticas
    const stageProbability: Record<string, number> = {
      'Prospecting': 0.1,
      'Qualified': 0.2,
      'Value Proposition': 0.4,
      'Proposal': 0.6,
      'Negotiation': 0.8,
      'Closed Won': 1.0
    };

    const stats = {
      total_pipeline: 0,
      weighted_pipeline: 0,
      revenue: 0,
      deals_by_stage: {} as Record<string, number>,
      count_by_stage: {} as Record<string, number>
    };

    data.forEach(deal => {
      const amount = Number(deal.amount) || 0;
      stats.total_pipeline += amount;

      if (deal.stage === 'Closed Won') {
        stats.revenue += amount;
      } else {
        const probability = stageProbability[deal.stage] || 0;
        stats.weighted_pipeline += amount * probability;
      }

      stats.deals_by_stage[deal.stage] = (stats.deals_by_stage[deal.stage] || 0) + amount;
      stats.count_by_stage[deal.stage] = (stats.count_by_stage[deal.stage] || 0) + 1;
    });

    return stats;
  }

  async exportToCSV(filters?: FilterParams): Promise<Deal[]> {
    let query = supabase.from('fe_deals').select('*');

    // Aplicar filtros
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    const { data, error } = await query;

    if (error || !data) {
      throw new Error('Failed to export deals');
    }

    return data;
  }
}

export default new DealsService();
