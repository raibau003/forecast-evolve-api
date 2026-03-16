import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload, AuthTokens } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateTokens = (payload: JWTPayload): AuthTokens => {
  const accessOptions: any = { expiresIn: JWT_EXPIRES_IN };
  const refreshOptions: any = { expiresIn: JWT_REFRESH_EXPIRES_IN };

  const accessToken = jwt.sign(payload as any, JWT_SECRET, accessOptions);
  const refreshToken = jwt.sign(payload as any, JWT_REFRESH_SECRET, refreshOptions);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};
