import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from './dto/credentials.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async signUp(credentialsDto: CredentialsDto): Promise<void> {
    try {
      const { username, password } = credentialsDto;

      const salt = await bcrypt.genSalt();

      const user = User.create({
        username,
        salt,
        password: await this.hashPassword(password, salt),
      });

      this.userService.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async signIn(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.validatePassword(credentialsDto);

    if (!username) throw new UnauthorizedException('Invalid credentials.');

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  private async validatePassword(
    credentialsDto: CredentialsDto,
  ): Promise<string> {
    const { username, password } = credentialsDto;
    const user = await this.userService.getByUsername(username);

    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isPasswordValid =
      (await this.hashPassword(password, user.salt)) === user.password;

    if (user && isPasswordValid) return user.username;
    else return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
