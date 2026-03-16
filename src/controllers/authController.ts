import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase';
import { hashPassword, createResponse, sanitizeEmail } from '../utils/helpers';

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = sanitizeEmail(email);
    const hashedPassword = hashPassword(password);

    // Buscar usuario en Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .eq('password', hashedPassword)
      .limit(1);

    if (error) {
      console.error('Error en login:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al autenticar usuario')
      );
    }

    if (!users || users.length === 0) {
      return res.status(401).json(
        createResponse(false, undefined, 'Credenciales inválidas')
      );
    }

    const user = users[0];

    // Generar JWT token
    const secret = process.env.JWT_SECRET || 'default_secret';

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || 'user'
      },
      secret,
      { expiresIn: '24h' }
    );

    return res.json(
      createResponse(
        true,
        {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user'
          }
        },
        undefined,
        'Login exitoso'
      )
    );
  } catch (error: any) {
    console.error('Error en login:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Registro de nuevo usuario
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    const cleanEmail = sanitizeEmail(email);
    const hashedPassword = hashPassword(password);

    // Verificar si el usuario ya existe
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(409).json(
        createResponse(false, undefined, 'El usuario ya existe')
      );
    }

    // Crear nuevo usuario
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email: cleanEmail,
          password: hashedPassword,
          name,
          role
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json(
        createResponse(false, undefined, 'Error al crear usuario')
      );
    }

    // Generar token para el nuevo usuario
    const secret = process.env.JWT_SECRET || 'default_secret';

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      secret,
      { expiresIn: '24h' }
    );

    return res.status(201).json(
      createResponse(
        true,
        {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
          }
        },
        undefined,
        'Usuario registrado exitosamente'
      )
    );
  } catch (error: any) {
    console.error('Error en registro:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};

/**
 * Obtener información del usuario actual
 * GET /api/auth/me
 */
export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        createResponse(false, undefined, 'No autenticado')
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json(
        createResponse(false, undefined, 'Usuario no encontrado')
      );
    }

    return res.json(
      createResponse(true, user)
    );
  } catch (error: any) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json(
      createResponse(false, undefined, 'Error interno del servidor')
    );
  }
};
