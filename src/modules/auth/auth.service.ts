import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(details: any): Promise<any> {
    console.log('validateUser', details);
    // Here, you would find or create a user in your database
    // For now, we'll just return the user details
    return details;
  }

  async login(user: User): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign(
        { sub: user.email },
        {
          secret: this.configService.get('secret'),
          expiresIn: this.configService.get('jwt.expiresIn'),
        },
      ),
    };
  }
}
