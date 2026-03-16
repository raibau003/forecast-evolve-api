import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { verifyRefreshToken, generateTokens } from '../utils/jwt';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
      const result = await authService.register(name, email, password, role);
      sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        sendError(res, 'Refresh token required', 400);
        return;
      }

      const payload = verifyRefreshToken(refreshToken);
      
      if (!payload) {
        sendError(res, 'Invalid refresh token', 401);
        return;
      }

      const tokens = generateTokens(payload);
      sendSuccess(res, { tokens }, 'Token refreshed successfully');
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }

  async me(req: any, res: Response): Promise<void> {
    try {
      const user = await authService.getUser(req.user.userId);
      
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, error.message, 500);
    }
  }
}

export default new AuthController();
