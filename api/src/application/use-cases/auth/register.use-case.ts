import {
  Injectable,
  ConflictException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { RegisterDto } from '../../dtos/register.dto';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    return user;
  }
}

