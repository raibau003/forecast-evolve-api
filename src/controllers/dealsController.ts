import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { createResponse, parseFilters } from '../utils/helpers';
import { jsonToCSV } from '../utils/csv';

/**
 * Obtener todos los deals con filtros, paginación y ordenamiento
 * GET /api/deals
 */
export const getDeals = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const sortBy = (req.query.sortBy as string) || 'created_at';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    const filters = parseFilters(req.query);

    // Construir query
    let query = supabase
      .from('deals')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters.stages && filters.stages.length > 0) {
      query = query.in('stage', filters.stages);
    }

    if (filters.country && filters.country.length > 0) {
      query = query.in('country', filters.country);
    }

    if (filters.software && filters.software.length > 0) {
      query = query.in('software', filters.software);
    }

    if (filters.owner && filters.owner.length > 0) {
      query = query.in('owner', filters.owner);
    }

    // Búsqueda de texto
    if (filters.search) {
      query = query.or(
        `company.ilike.%${filters.search}%,project.ilike.%${filters.search}%,sponsor.ilike.%${filters.search}%`
      );
    }

    // Ordenamiento
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error al obtener deals:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al obtener oportunidades')
      );
    }

    return res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error: any) {
    console.error('Error en getDeals:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Obtener un deal por ID
 * GET /api/deals/:id
 */
export const getDealById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json(
        createResponse(false, undefined, 'Oportunidad no encontrada')
      );
    }

    return res.json(createResponse(true, data));
  } catch (error: any) {
    console.error('Error en getDealById:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Crear un nuevo deal
 * POST /api/deals
 */
export const createDeal = async (req: Request, res: Response) => {
  try {
    const dealData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select()
      .single();

    if (error) {
      console.error('Error al crear deal:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al crear oportunidad')
      );
    }

    return res.status(201).json(
      createResponse(true, data, undefined, 'Oportunidad creada exitosamente')
    );
  } catch (error: any) {
    console.error('Error en createDeal:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Actualizar un deal existente
 * PUT /api/deals/:id
 */
export const updateDeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('deals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar deal:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al actualizar oportunidad')
      );
    }

    if (!data) {
      return res.status(404).json(
        createResponse(false, undefined, 'Oportunidad no encontrada')
      );
    }

    return res.json(
      createResponse(true, data, undefined, 'Oportunidad actualizada exitosamente')
    );
  } catch (error: any) {
    console.error('Error en updateDeal:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Eliminar un deal
 * DELETE /api/deals/:id
 */
export const deleteDeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar deal:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al eliminar oportunidad')
      );
    }

    return res.json(
      createResponse(true, undefined, undefined, 'Oportunidad eliminada exitosamente')
    );
  } catch (error: any) {
    console.error('Error en deleteDeal:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Exportar deals a CSV
 * GET /api/deals/export/csv
 */
export const exportDealsCSV = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req.query);

    // Construir query (sin paginación para exportar todo)
    let query = supabase.from('deals').select('*');

    // Aplicar filtros
    if (filters.stages && filters.stages.length > 0) {
      query = query.in('stage', filters.stages);
    }

    if (filters.country && filters.country.length > 0) {
      query = query.in('country', filters.country);
    }

    if (filters.software && filters.software.length > 0) {
      query = query.in('software', filters.software);
    }

    if (filters.owner && filters.owner.length > 0) {
      query = query.in('owner', filters.owner);
    }

    if (filters.search) {
      query = query.or(
        `company.ilike.%${filters.search}%,project.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al exportar deals:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al exportar datos')
      );
    }

    if (!data || data.length === 0) {
      return res.status(404).json(
        createResponse(false, undefined, 'No hay datos para exportar')
      );
    }

    // Convertir a CSV
    const fields = [
      'id',
      'company',
      'project',
      'stage',
      'close_date',
      'amount',
      'software',
      'country',
      'power_sponsor',
      'sponsor',
      'owner',
      'next_steps',
      'next_steps_date',
      'created_at',
      'updated_at'
    ];

    const csv = jsonToCSV(data, fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="deals_export_${new Date().toISOString()}.csv"`);

    return res.send(csv);
  } catch (error: any) {
    console.error('Error en exportDealsCSV:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Obtener estadísticas de deals
 * GET /api/deals/stats
 */
export const getDealsStats = async (req: Request, res: Response) => {
  try {
    const { data: allDeals, error } = await supabase
      .from('deals')
      .select('stage, amount, close_date, country');

    if (error) {
      console.error('Error al obtener estadísticas:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al obtener estadísticas')
      );
    }

    const stats = {
      total: allDeals.length,
      byStage: {} as Record<string, number>,
      byCountry: {} as Record<string, number>,
      totalAmount: 0,
      avgAmount: 0
    };

    let totalAmount = 0;
    let countWithAmount = 0;

    allDeals.forEach(deal => {
      // Por etapa
      stats.byStage[deal.stage] = (stats.byStage[deal.stage] || 0) + 1;

      // Por país
      stats.byCountry[deal.country] = (stats.byCountry[deal.country] || 0) + 1;

      // Monto total
      const amount = parseFloat(deal.amount);
      if (!isNaN(amount) && amount > 0) {
        totalAmount += amount;
        countWithAmount++;
      }
    });

    stats.totalAmount = totalAmount;
    stats.avgAmount = countWithAmount > 0 ? totalAmount / countWithAmount : 0;

    return res.json(createResponse(true, stats));
  } catch (error: any) {
    console.error('Error en getDealsStats:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};
