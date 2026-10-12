import { IUserRepository } from '../domain/user.repository.interface';
import { UserEntity } from '../domain/user.entity';

export interface SignupInput {
  email: string;
  password: string;
}

export class SignupUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: SignupInput): Promise<Omit<UserEntity, 'passwordHash'>> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error('E-mail já cadastrado');
    }

    // Em produção, aplicar hash (ex: bcrypt.hash)
    const passwordHash = `mock_hash_${Buffer.from(input.password).toString('base64')}`;

    const user = await this.userRepo.create({
      email: input.email,
      passwordHash
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
