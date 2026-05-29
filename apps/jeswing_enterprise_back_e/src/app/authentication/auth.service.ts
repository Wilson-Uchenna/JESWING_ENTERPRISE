import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthInput, LoginInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../generated/prisma/enums';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './dto/auth-response';
import { Auth } from './entities/auth.entity';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configservice: ConfigService,
  ) {}

  private generateTokens(user: { id: string; email: string; role: UserRole }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configservice.get<string>('jwt.secret'),
        expiresIn: this.configservice.get<string>(
          'jwt.expiresIn',
        ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configservice.get<string>('jwt.refreshSecret'),
        expiresIn: this.configservice.get<string>(
          'jwt.refreshExpiresIn',
        ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
    };
  }

  async register(createAuthInput: CreateAuthInput): Promise<LoginResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createAuthInput.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(
      createAuthInput.password,
      Number(process.env.SALT_ROUNDS) || 10,
    );

    const user = await this.prisma.user.create({
      data: {
        ...createAuthInput,
        password: hashPassword,
        role: UserRole.CUSTOMER,
      },
    });

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
          role: user.role,
      },
    };
  }

  async update(id: string, updateAuthInput: UpdateAuthInput) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateAuthInput.password) {
      // Compare new password with existing one
      const isSamePassword = await bcrypt.compare(
        updateAuthInput.password,
        user.password,
      );

      if (isSamePassword) {
        throw new ConflictException(
          'New password cannot be the same as the old password',
        );
      }

      updateAuthInput.password = await bcrypt.hash(
        updateAuthInput.password,
        10,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateAuthInput,
    });
  }

  async login(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });

    if (!user) {
      throw new NotFoundException('This user cannot does not exist');
    }

    const isSamePassword = await bcrypt.compare(
      loginInput.password,
      user.password,
    );

    if (!isSamePassword) {
      throw new UnauthorizedException('Password is not correct');
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    };
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
  async updateUserRole(userId: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async me(userId: string): Promise<Auth> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
  }

 async refreshTokens(token: string) {
  let payload: TokenPayload;

  try {
    payload = this.jwtService.verify<TokenPayload>(token, {
      secret: this.configservice.get('jwt.refreshSecret'),
    });
  } catch {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }

  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) throw new NotFoundException('User not found');

  return this.generateTokens(user);
}
}
