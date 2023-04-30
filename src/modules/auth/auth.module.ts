import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt.module';

@Module({
  imports: [JwtModule, ConfigModule, PassportModule],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
