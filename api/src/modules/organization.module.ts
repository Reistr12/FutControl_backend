import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Organization } from '@domain/entities/organization.entity';
import { OrganizationRole } from '@domain/entities/organization-role.entity';
import { OrganizationMember } from '@domain/entities/organization-member.entity';
import { User } from '@domain/entities/user.entity';
import { OrganizationController } from '@presentation/controllers/organization.controller';
import { OrganizationRepository, OrganizationRoleRepository, OrganizationMemberRepository } from '@infrastructure/repositories/organization.repository';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { ListOrganizationsUseCase } from '@application/use-cases/organizations/list-organizatios.usecase';
import { CreateOrganizationUseCase } from '@application/use-cases/organizations/create-organization.use-case';
import { GetOrganizationUseCase } from '@application/use-cases/organizations/get-organization.use-case';
import { UpdateOrganizationUseCase } from '@application/use-cases/organizations/update-organization.use-case';
import { DeleteOrganizationUseCase } from '@application/use-cases/organizations/delete-organization.use-case';
import { CreateOrganizationRoleUseCase } from '@application/use-cases/organization-roles/create-organization-role.use-case';
import { GetOrganizationRolesUseCase } from '@application/use-cases/organization-roles/get-organization-roles.use-case';
import { DeleteOrganizationRoleUseCase } from '@application/use-cases/organization-roles/delete-organization-role.use-case';
import { GetUserRolesInOrganizationUseCase } from '@application/use-cases/organization-roles/get-user-roles-in-organization.use-case';
import { CreateOrganizationMemberUseCase } from '@application/use-cases/organization-members/create-organization-member.use-case';
import { GetOrganizationMembersUseCase } from '@application/use-cases/organization-members/get-organization-members.use-case';
import { DeleteOrganizationMemberUseCase } from '@application/use-cases/organization-members/delete-organization-member.use-case';
import { OrganizationAccessService } from '@application/services/organization-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationRole, OrganizationMember, User]),
  ],
  controllers: [
    OrganizationController,
  ],
  providers: [
    {
      provide: 'IOrganizationRepository',
      useClass: OrganizationRepository,
    },
    {
      provide: 'IOrganizationRoleRepository',
      useClass: OrganizationRoleRepository,
    },
    {
      provide: 'IOrganizationMemberRepository',
      useClass: OrganizationMemberRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    ListOrganizationsUseCase,
    CreateOrganizationUseCase,
    GetOrganizationUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
    CreateOrganizationRoleUseCase,
    GetOrganizationRolesUseCase,
    DeleteOrganizationRoleUseCase,
    GetUserRolesInOrganizationUseCase,
    CreateOrganizationMemberUseCase,
    GetOrganizationMembersUseCase,
    DeleteOrganizationMemberUseCase,
    OrganizationAccessService,
  ],
})
export class OrganizationModule {}