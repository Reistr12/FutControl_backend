import { CreateInviteDto } from "@application/dtos/create-invite-dto";
import { Invite } from "@domain/entities/invite.entity";
import type { IInviteRepository } from "@domain/repositories/invite.repository.interface";
import type { IOrganizationRepository } from "@domain/repositories/organization.repository.interface";
import type { IUserRepository } from "@domain/repositories/user.repository.interface";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateInviteUseCase {
    constructor(
        @Inject('IOrganizationRepository')
        private readonly  organizationRepository: IOrganizationRepository,
        @Inject('IInviteRepository')
        private readonly inviteRepository: IInviteRepository,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}
    async execute(organizationId: string, userId: string, email: CreateInviteDto): Promise<Invite> {
        const organization = await this.organizationRepository.findById(organizationId);

        if (!organization) {
            throw new BadRequestException('Organização não encontrada');
        }

        const user = await this.userRepository.findByEmail(email.email);

        if (!user) {
            throw new BadRequestException('Usuário com este email não encontrado');
        }

        const invite = await this.inviteRepository.create(organization.id, user.id, email.email, userId);

        return invite;
    }
}