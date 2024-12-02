import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req) => req.headers.authorization ?? null,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  public async validate(payload: JwtPayload): Promise<string> {
    return payload.id;
  }
}
