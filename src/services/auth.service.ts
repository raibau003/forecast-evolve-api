import supabase from '../config/database';
import { User, AuthTokens } from '../types';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens } from '../utils/jwt';

export class AuthService {
  async register(name: string, email: string, password: string, role: string = 'seller'): Promise<{ user: User; tokens: AuthTokens }> {
    // Verificar si el usuario ya existe
    const { data: existing } = await supabase
      .from('fe_users')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      throw new Error('User already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario (aprobado solo si es admin)
    const approved = role === 'admin';
    const { data: user, error } = await supabase
      .from('fe_users')
      .insert([{ name, email, password: hashedPassword, role, approved }])
      .select()
      .single();

    if (error || !user) {
      throw new Error('Failed to create user');
    }

    // Generar tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // No devolver el password
    delete user.password;

    return { user, tokens };
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Buscar usuario
    const { data: user, error } = await supabase
      .from('fe_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verificar si está aprobado
    if (!user.approved) {
      throw new Error('User not approved yet. Please wait for admin approval.');
    }

    // Verificar contraseña
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generar tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // No devolver el password
    delete user.password;

    return { user, tokens };
  }

  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('fe_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    delete data.password;
    return data;
  }
}

export default new AuthService();
