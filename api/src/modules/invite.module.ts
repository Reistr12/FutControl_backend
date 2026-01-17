import { OrganizationRepository } from "@infrastructure/repositories/organization.repository";
import { UserRepository } from "@infrastructure/repositories/user.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InviteController } from "@presentation/controllers/invite.controller";
import { InviteRepository } from "@infrastructure/repositories/invite.repository";
import { CreateInviteUseCase } from "@application/use-cases/invites/create-invite.usecase";
import { ListInvitesByIdUseCase } from "@application/use-cases/invites/list-invites-by-id.usecase";
import { AcceptInviteUseCase } from "@application/use-cases/invites/accept-invite.usecase";
import { ListUserInvitesUseCase } from "@application/use-cases/invites/list-user-invites.usecase";
import { AcceptUserInviteUseCase } from "@application/use-cases/invites/accept-user-invite.usecase";
import { Organization } from "@domain/entities/organization.entity";
import { OrganizationRole } from "@domain/entities/organization-role.entity";
import { OrganizationMember } from "@domain/entities/organization-member.entity";
import { Invite } from "@domain/entities/invite.entity";
import { Role } from "@domain/entities/role.entity";
import { User } from "@domain/entities/user.entity";
import { OrganizationAccessService } from "@application/services/organization-access.service";
import { OrganizationRoleService } from "@application/services/organization-role.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Organization, OrganizationRole, OrganizationMember, Invite, Role, User])
    ],
    controllers: [
        InviteController
    ],
    providers: [
        {
        provide: 'IOrganizationRepository',
        useClass: OrganizationRepository,
        },
        {
        provide: 'IInviteRepository',
        useClass: InviteRepository,
        },
        {
        provide: 'IUserRepository',
        useClass: UserRepository,
        },
        OrganizationAccessService,
        OrganizationRoleService,
        CreateInviteUseCase,
        ListInvitesByIdUseCase,
        AcceptInviteUseCase,
        ListUserInvitesUseCase,
        AcceptUserInviteUseCase,
    ],
})
export class InviteModule {}
