import { Router } from 'express';
import { PrismaUserRepository } from '../infra/prisma-user.repository';
import { SignupUseCase } from '../app/signup.usecase';
import { LoginUseCase } from '../app/login.usecase';
import { UsuariosController } from './usuarios.controller';

export const usuariosRoutes = Router();

const userRepo = new PrismaUserRepository();
const signupUseCase = new SignupUseCase(userRepo);
const loginUseCase = new LoginUseCase(userRepo);
const controller = new UsuariosController(signupUseCase, loginUseCase);

usuariosRoutes.post('/usuarios/signup', (req, res) => controller.signup(req, res));
usuariosRoutes.post('/usuarios/login', (req, res) => controller.login(req, res));
