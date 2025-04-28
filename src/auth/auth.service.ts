import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokens(userId: string, name: string, role: string) {
    const accessToken = this.jwtService.sign(
      {
        fullname: name,
        sub: userId,
        permission: role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3,
      },
      {
        expiresIn: '3h',
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      {
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async register(data: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    if (data.password !== data.confirmPassword) {
      return new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const hashedPassword = await hash(data.password);

    const createUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: 'GUESS',
      },
    });

    return createUser;
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const valid = await verify(data.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.generateTokens(user.id, user.name, user.role);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
      },
    });

    return {
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.session.delete({
      where: { refreshToken },
    });

    return 'Session Deleted';
  }

  async refreshToken(userId: string, refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      throw new NotFoundException('Session or user not found');
    }

    const tokens = await this.generateTokens(
      userId,
      session.user.name,
      session.user.role,
    );

    return {
      ...tokens,
    };
  }
}
