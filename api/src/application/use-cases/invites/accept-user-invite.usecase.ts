import { OrganizationRoleService } from "@application/services/organization-role.service";
import { Invite } from "@domain/entities/invite.entity";
import type { IInviteRepository } from "@domain/repositories/invite.repository.interface";
import type { IOrganizationRepository } from "@domain/repositories/organization.repository.interface";
import { BadRequestException, Injectable, Inject } from "@nestjs/common";

@Injectable()
export class AcceptUserInviteUseCase {
    constructor(
        @Inject('IInviteRepository')
        private readonly inviteRepository: IInviteRepository,
        @Inject('IOrganizationRepository')
        private readonly organizationRepository: IOrganizationRepository,
        private readonly organizationRoleService: OrganizationRoleService,
    ) {}

    async execute(inviteId: string, userId: string): Promise<Invite> {
        const invite = await this.inviteRepository.findById(inviteId);
        
        if (!invite || invite.accepted) {
            throw new BadRequestException('O convite não existe ou já foi aceito');
        }

        if (invite.userId !== userId) {
            throw new BadRequestException('Este convite não pertence a você');
        }
        
        const acceptedInvite = await this.inviteRepository.acceptInvite(inviteId);

        const member = await this.organizationRepository.createMember({
            organizationId: acceptedInvite.organizationId,
            userId: acceptedInvite.userId,
        });

        const memberRole = await this.organizationRepository.findRoleByName('member');
        if (memberRole) {
            await this.organizationRoleService.createOrganizationRole(
                member.id,
                acceptedInvite.organizationId,
                memberRole.roleId
            );
        }

        return acceptedInvite;
    }
}
