import { OrganizationAccessService } from "@application/services/organization-access.service";
import { Match } from "@domain/entities/match.entity";
import type { IMatchRepository } from "@domain/repositories/match.repository.interface";
import { CurrentUserData } from "@infrastructure/decorators/current-user.decorator";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ListMatchesUseCase {
    constructor(
        @Inject('IMatchRepository')
        private readonly matchRepository: IMatchRepository,
        private readonly organizationAccessService: OrganizationAccessService
    )
     {}
    async execute(idOrganization: string, user: CurrentUserData): Promise<Match[]> {
        const isMember = await this.organizationAccessService.verifyUserIsMember(user.id, idOrganization);

        if (!isMember) {
            throw new BadRequestException('Usuário não faz parte da organização')
        }
        
        const matches = await this.matchRepository.findByOrganizationId(idOrganization);

        return matches;
    }
}