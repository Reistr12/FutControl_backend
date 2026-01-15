import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/domain/entities/user.entity';
import { Role } from './src/domain/entities/role.entity';
import { Organization } from './src/domain/entities/organization.entity';
import { OrganizationRole } from './src/domain/entities/organization-role.entity';
import { OrganizationMember } from './src/domain/entities/organization-member.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'futcontrol',
  entities: [
    User,
    Role,
    Organization,
    OrganizationRole,
    OrganizationMember,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

