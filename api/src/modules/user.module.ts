import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UserController } from '../presentation/controllers/user.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}

