import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { jwtConstants } from '../../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        specialty: user.specialty,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        dni: registerDto.dni,
        phone: registerDto.phone,
        role: registerDto.role,
        specialty: registerDto.specialty,
      },
    });

    const { password, ...result } = user;

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: result,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newPayload = { email: user.email, sub: user.id, role: user.role };

      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '1h' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Token de refresco inválido');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dni: true,
        phone: true,
        role: true,
        specialty: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  async validateSocialUser(socialProfile: any) {
    const { email, firstName, lastName } = socialProfile;

    if (!email) {
      throw new UnauthorizedException(
        'El correo electrónico es requerido para el inicio de sesión social.',
      );
    }

    // 1. Buscar si el usuario ya existe por email
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2. Si no existe, crearlo
    if (!user) {
      // Generar contraseña aleatoria segura y hashearla
      const randomPassword = Math.random().toString(36).slice(-16) + 'A1!';
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: firstName || 'Usuario',
          lastName: lastName || 'Social',
          role: 'PATIENT',
          avatarUrl: socialProfile.picture || null,
        },
      });
    } else if (!user.avatarUrl && socialProfile.picture) {
      // Si ya existe pero no tiene avatar, se lo actualizamos
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: socialProfile.picture },
      });
    }

    // 3. Generar tokens de sesión
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        specialty: user.specialty,
      },
    };
  }
}
