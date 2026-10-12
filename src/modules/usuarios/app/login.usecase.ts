import { IUserRepository } from '../domain/user.repository.interface';
import { UserEntity } from '../domain/user.entity';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  token: string;
  user: Omit<UserEntity, 'passwordHash'>;
}

export class LoginUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Validação de senha simplificada para stub
    const expectedHash = `mock_hash_${Buffer.from(input.password).toString('base64')}`;
    if (user.passwordHash !== expectedHash && !user.passwordHash.startsWith('$2b$')) {
      throw new Error('Credenciais inválidas');
    }

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      token: `fake-jwt-token-for-user-${user.id}`,
      user: userWithoutPassword
    };
  }
}
