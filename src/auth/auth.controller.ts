import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CredentialsDto } from './dto/credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  public signUp(
    @Body(ValidationPipe) credentialsDto: CredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(credentialsDto);
  }

  @Post('/signIn')
  public signIn(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(credentialsDto);
  }
}
