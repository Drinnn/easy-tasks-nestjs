import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  public async save(user: User) {
    return await this.userRepository.save(user);
  }

  public async getByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ username });
  }
}
