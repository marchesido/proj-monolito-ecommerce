import { describe, it, expect } from 'vitest';
import { SignupUseCase } from './app/signup.usecase';
import { LoginUseCase } from './app/login.usecase';
import { IUserRepository } from './domain/user.repository.interface';
import { UserEntity } from './domain/user.entity';

class MockUserRepository implements IUserRepository {
  private users: UserEntity[] = [];

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async create(data: { email: string; passwordHash: string; role?: string }): Promise<UserEntity> {
    const user: UserEntity = {
      id: `usr-${Date.now()}`,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role || 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }
}

describe('Módulo de Usuários', () => {
  it('deve cadastrar um novo usuário com sucesso', async () => {
    const repo = new MockUserRepository();
    const useCase = new SignupUseCase(repo);

    const result = await useCase.execute({
      email: 'novo@teste.com',
      password: 'senhaSegura123'
    });

    expect(result.id).toBeDefined();
    expect(result.email).toBe('novo@teste.com');
  });

  it('deve realizar login para usuário cadastrado', async () => {
    const repo = new MockUserRepository();
    const signup = new SignupUseCase(repo);
    const login = new LoginUseCase(repo);

    await signup.execute({
      email: 'login@teste.com',
      password: 'minhaSenha'
    });

    const result = await login.execute({
      email: 'login@teste.com',
      password: 'minhaSenha'
    });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('login@teste.com');
  });
});
