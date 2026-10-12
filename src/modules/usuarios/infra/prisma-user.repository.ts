import { IUserRepository } from '../domain/user.repository.interface';
import { UserEntity } from '../domain/user.entity';
import { prisma } from '../../../shared/infra/database/prisma';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; passwordHash: string; role?: string }): Promise<UserEntity> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || 'CUSTOMER'
      }
    });
  }
}
