import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ethers, recoverAddress, toUtf8Bytes, toBeArray } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signature: string): Promise<string> {
    try {
      if (!signature) throw new UnauthorizedException();

      const message = 'authentication';
      const messageLength = new Blob([message]).size;
      const messageArray =
        //ethers(
        ethers.toUtf8Bytes(
          `\x19Ethereum Signed Message:\n${messageLength}${message}`,
        );
      // );
      const messageHash = ethers.keccak256(messageArray);
      const address = ethers.recoverAddress(messageHash, signature);

      // const messageBytes = ethers.toUtf8Bytes('authentication');

      // const address = ethers.verifyMessage('authentication', message);

      // const m = 'authentication';
      // const messageLength = new Blob([]).size;
      // const messageArray = ethers.arrayify(ethers.toUtf8Bytes(`\x19Ethereum Signed Message:\n${messageLength}${m}`));
      // const messageHash = ethers.keccak256(messageArray);
      // const address = ethers.recoverAddress(messageHash, message);
      // return address;

      // const messageBytes = ethers.toUtf8Bytes('authentication');
      // const messageDigest = ethers.keccak256(messageBytes);
      // const address = ethers.recoverAddress(messageDigest, message);
      // return recoveredAddress;
      //
      // const address = ethers.recoverAddress(
      //   // 'authentication',
      //   // "0xc5aeb0f24fd8611a25a4f608f62472f1b35afca0b836027fa16d06d8cc4731db",
      //   "0x9bd24fb9d72ba6b423b1fc0971bad53905a9b45dd4f5b23ae1e7924a3b2d6e9b",
      //   message,
      // );

      console.log('address', address);

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
