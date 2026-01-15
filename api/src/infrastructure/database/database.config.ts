import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { Organization } from '../../domain/entities/organization.entity';
import { OrganizationRole } from '../../domain/entities/organization-role.entity';
import { OrganizationMember } from '../../domain/entities/organization-member.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [
        User,
        Role,
        Organization,
        OrganizationRole,
        OrganizationMember,
      ],
      synchronize: this.configService.get<string>('NODE_ENV') === 'development',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
    };
  }
}

