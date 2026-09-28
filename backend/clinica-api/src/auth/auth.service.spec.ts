import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrisma = {
    usuario: {
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('token_falso_jwt'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('debe retornar null si el usuario no existe', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('noexiste', 'password');

      expect(result).toBeNull();
      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { username: 'noexiste' },
      });
    });

    it('debe retornar null si la contraseña es incorrecta', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        username: 'admin',
        password: 'hash_almacenado',
        role: 'admin',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('admin', 'wrong');

      expect(result).toBeNull();
    });

    it('debe retornar el usuario si las credenciales son válidas', async () => {
      const usuarioMock = {
        id: 1,
        username: 'admin',
        password: 'hash_almacenado',
        role: 'admin',
      };
      mockPrisma.usuario.findUnique.mockResolvedValue(usuarioMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('admin', 'admin');

      expect(result).toEqual(usuarioMock);
    });
  });

  describe('login', () => {
    it('debe retornar un token JWT y los datos del usuario', () => {
      const user = { id: 1, username: 'admin', role: 'admin' };

      const result = service.login(user);

      expect(result).toHaveProperty('access_token', 'token_falso_jwt');
      expect(result.user).toEqual({
        id: 1,
        username: 'admin',
        role: 'admin',
      });
      expect(mockJwt.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: 1,
        role: 'admin',
      });
    });
  });
});