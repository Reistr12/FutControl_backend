import { Invite } from "@domain/entities/invite.entity";
import type { IInviteRepository } from "@domain/repositories/invite.repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ListUserInvitesUseCase {
    constructor(
        @Inject('IInviteRepository')
        private readonly inviteRepository: IInviteRepository,
    ) {}

    async execute(userId: string): Promise<Invite[]> {
        return await this.inviteRepository.findByUserId(userId);
    }
}
