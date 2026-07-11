import { User, RegisterData } from '../types/index';
import { userRepository } from '../repositories/UserRepository';
import { ConflictError } from '../utils/errors';

export class AuthService {
  async register(data: RegisterData & { id?: string }): Promise<{ user: Omit<User, 'passwordHash'> }> {
    // Check if email already exists
    if (await userRepository.emailExists(data.email)) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    if (await userRepository.usernameExists(data.username)) {
      throw new ConflictError('Username already taken');
    }

    // Create user in our public.users table.
    // Auth logic (passwords, tokens) is handled by Supabase Auth on the frontend.
    const user = await userRepository.create({
      id: data.id,
      email: data.email,
      username: data.username,
      passwordHash: '', // Not used anymore since we use Supabase Auth
      firstName: data.firstName,
      lastName: data.lastName,
      plan: 'free',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
    };
  }

  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await userRepository.findById(userId);
    if (!user) return null;

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(
    userId: string,
    updates: { firstName?: string; lastName?: string; avatar?: string }
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await userRepository.update(userId, updates);
    if (!user) return null;

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
