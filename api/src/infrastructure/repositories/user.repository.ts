import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.typeOrmRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.typeOrmRepository.create(user);
    return this.typeOrmRepository.save(newUser);
  }

  async save(user: User): Promise<User> {
    return this.typeOrmRepository.save(user);
  }
}

