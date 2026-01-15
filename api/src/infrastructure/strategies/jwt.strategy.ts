import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { IJwtPayload } from '../../application/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

