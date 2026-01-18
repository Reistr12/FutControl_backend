import { OrganizationAccessService } from "@application/services/organization-access.service";
import { Invite } from "@domain/entities/invite.entity";
import type { IInviteRepository } from "@domain/repositories/invite.repository.interface";
import type { IOrganizationRepository } from "@domain/repositories/organization.repository.interface";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ListInvitesByIdUseCase {
    constructor(
        @Inject('IInviteRepository')
        private readonly inviteRepository: IInviteRepository,
        @Inject('IOrganizationRepository')
        private readonly organizationRepository: IOrganizationRepository,
        private readonly organizationAccessService: OrganizationAccessService,
    ) {}

    async execute(organizationId: string, userId): Promise<Invite[]> {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new BadRequestException('Organização não encontrada');
        }

        const isAdmin = await this.organizationAccessService.verifyUserHasRole(userId, organization.id, 'admin');

        if (!isAdmin) {
            throw new BadRequestException('Usuário não tem permissão para listar os convites desta organização');
        }

        const invites: Invite[] = await this.inviteRepository.findByOrganizationId(organizationId);

        return invites || [];
    }
}