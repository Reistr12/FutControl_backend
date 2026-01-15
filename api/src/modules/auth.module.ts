import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { AuthController } from '@presentation/controllers/auth.controller';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, 'IUserRepository'],
})
export class AuthModule {}

