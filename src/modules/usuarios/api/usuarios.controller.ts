import { Request, Response } from 'express';
import { SignupUseCase } from '../app/signup.usecase';
import { LoginUseCase } from '../app/login.usecase';

export class UsuariosController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
      }

      const user = await this.signupUseCase.execute({ email, password });
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Erro ao criar usuário' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
      }

      const result = await this.loginUseCase.execute({ email, password });
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message || 'Credenciais inválidas' });
    }
  }
}
