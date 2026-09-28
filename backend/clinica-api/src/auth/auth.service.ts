import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string) {
    // 1. Buscar el usuario en la base de datos mediante Prisma (Repository Pattern)
    const usuario = await this.prisma.usuario.findUnique({
      where: { username },
    });

    if (!usuario) {
      return null;
    }

    // 2. Comparar la contraseña ingresada con el hash almacenado
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return null;
    }

    return usuario;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}