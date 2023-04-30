import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ethers, recoverAddress, toUtf8Bytes } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(message: string): Promise<string> {
    try {
      if (!message) throw new UnauthorizedException();

      const address = ethers.recoverAddress(
        "0x9bd24fb9d72ba6b423b1fc0971bad53905a9b45dd4f5b23ae1e7924a3b2d6e9b",
        message,
      );

      return this.jwtService.signAsync(
        { id: address },
        {
          secret: this.configService.get('secret'),
          expiresIn: this.configService.get('jwt.expiresIn'),
        },
      );
    } catch (e) {
      console.log('e', e);
    }
  }
}
