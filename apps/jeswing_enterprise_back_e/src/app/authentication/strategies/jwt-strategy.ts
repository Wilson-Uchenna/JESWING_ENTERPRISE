import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'), // 👈 must match what signed the token
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
     console.log('JwtStrategy validate payload:', payload);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}