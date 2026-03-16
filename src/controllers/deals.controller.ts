import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import dealsService from '../services/deals.service';
import { sendSuccess, sendError, sendPaginatedResponse } from '../utils/response';
import { Parser } from 'json2csv';

export class DealsController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';
      
      const filters: any = {};
      if (req.query.stage) filters.stage = req.query.stage;
      if (req.query.country) filters.country = req.query.country;
      if (req.query.software) filters.software = req.query.software;
      if (req.query.owner_id) filters.owner_id = req.query.owner_id;

      const result = await dealsService.getAll({ page, limit, sortBy, sortOrder }, filters);
      sendPaginatedResponse(res, result.data, { page, limit, total: result.total });
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deal = await dealsService.getById(id);
      
      if (!deal) {
        sendError(res, 'Deal not found', 404);
        return;
      }

      sendSuccess(res, { deal });
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const deal = await dealsService.create(req.body, req.user!.userId);
      sendSuccess(res, { deal }, 'Deal created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deal = await dealsService.update(id, req.body);
      sendSuccess(res, { deal }, 'Deal updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await dealsService.delete(id);
      sendSuccess(res, null, 'Deal deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.query.ownerId as string;
      const stats = await dealsService.getStats(ownerId);
      sendSuccess(res, { stats });
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }

  async export(req: AuthRequest, res: Response): Promise<void> {
    try {
      const filters: any = {};
      if (req.query.stage) filters.stage = req.query.stage;
      if (req.query.country) filters.country = req.query.country;
      if (req.query.software) filters.software = req.query.software;

      const deals = await dealsService.exportToCSV(filters);
      
      const parser = new Parser();
      const csv = parser.parse(deals);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=deals.csv');
      res.send(csv);
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}

export default new DealsController();
