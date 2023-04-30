import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthPayload } from './auth.interface';
import { AuthService } from './auth.service';

@Resolver(() => AuthPayload)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signIn(
    @Args('message', { type: () => String }) message: string,
  ): Promise<AuthPayload> {
    const accessToken = await this.authService.signIn(message);
    return { accessToken };
  }
}
