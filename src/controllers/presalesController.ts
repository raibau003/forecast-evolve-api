import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { createResponse, parseFilters } from '../utils/helpers';
import { jsonToCSV } from '../utils/csv';

/**
 * Obtener todos los presales con filtros y paginación
 * GET /api/presales
 */
export const getPresales = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const sortBy = (req.query.sortBy as string) || 'created_at';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    const filters = parseFilters(req.query);

    let query = supabase
      .from('presales')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters.owner && filters.owner.length > 0) {
      query = query.in('owner', filters.owner);
    }

    if (filters.search) {
      query = query.or(
        `client.ilike.%${filters.search}%,project.ilike.%${filters.search}%`
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
      console.error('Error al obtener presales:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al obtener preventas')
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
    console.error('Error en getPresales:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Obtener presale por ID
 * GET /api/presales/:id
 */
export const getPresaleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('presales')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json(
        createResponse(false, undefined, 'Preventa no encontrada')
      );
    }

    return res.json(createResponse(true, data));
  } catch (error: any) {
    console.error('Error en getPresaleById:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Crear nuevo presale
 * POST /api/presales
 */
export const createPresale = async (req: Request, res: Response) => {
  try {
    const presaleData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('presales')
      .insert([presaleData])
      .select()
      .single();

    if (error) {
      console.error('Error al crear presale:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al crear preventa')
      );
    }

    return res.status(201).json(
      createResponse(true, data, undefined, 'Preventa creada exitosamente')
    );
  } catch (error: any) {
    console.error('Error en createPresale:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Actualizar presale
 * PUT /api/presales/:id
 */
export const updatePresale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('presales')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar presale:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al actualizar preventa')
      );
    }

    if (!data) {
      return res.status(404).json(
        createResponse(false, undefined, 'Preventa no encontrada')
      );
    }

    return res.json(
      createResponse(true, data, undefined, 'Preventa actualizada exitosamente')
    );
  } catch (error: any) {
    console.error('Error en updatePresale:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Eliminar presale
 * DELETE /api/presales/:id
 */
export const deletePresale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('presales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar presale:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al eliminar preventa')
      );
    }

    return res.json(
      createResponse(true, undefined, undefined, 'Preventa eliminada exitosamente')
    );
  } catch (error: any) {
    console.error('Error en deletePresale:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Exportar presales a CSV
 * GET /api/presales/export/csv
 */
export const exportPresalesCSV = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req.query);

    let query = supabase.from('presales').select('*');

    if (filters.owner && filters.owner.length > 0) {
      query = query.in('owner', filters.owner);
    }

    if (filters.search) {
      query = query.or(
        `client.ilike.%${filters.search}%,project.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al exportar presales:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al exportar datos')
      );
    }

    if (!data || data.length === 0) {
      return res.status(404).json(
        createResponse(false, undefined, 'No hay datos para exportar')
      );
    }

    const fields = [
      'id',
      'client',
      'project',
      'stage',
      'next_steps',
      'next_steps_date',
      'owner',
      'document_url',
      'created_at',
      'updated_at'
    ];

    const csv = jsonToCSV(data, fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="presales_export_${new Date().toISOString()}.csv"`);

    return res.send(csv);
  } catch (error: any) {
    console.error('Error en exportPresalesCSV:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};
