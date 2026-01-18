import { OrganizationAccessService } from "@application/services/organization-access.service";
import { Organization } from "@domain/entities/organization.entity";
import type { IOrganizationRepository } from "@domain/repositories/organization.repository.interface";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class ListOrganizationsUseCase {
    constructor(
        @Inject('IOrganizationRepository')
        private readonly organizationRepository: IOrganizationRepository,
        private readonly organizationAccessService: OrganizationAccessService,
    ) {}

    async execute(params: {
        search?: string;
        userId: string;
        isPublic?: boolean;
    }): Promise<Organization[] | null> {
        const { search, userId, isPublic } = params;

        if(!userId) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        let allOrganizations = await this.organizationRepository.listOrganizations(isPublic);

        let organizationsWithUser: any[] = [];
        if (!isPublic) {
            await Promise.all(allOrganizations.map(async organization => {
                const member = await this.organizationAccessService.verifyUserIsMember(userId, organization.id);
                if (member) {
                    organizationsWithUser.push({
                        ...organization,
                        organizationRole: member.organizationRole,
                    });
                }
            }));

            allOrganizations = organizationsWithUser;
        }

        if (search && isPublic) {
            allOrganizations = allOrganizations.filter(organization => organization && organization.name.toLowerCase().includes(search.toLowerCase()));
        } else if (search && !isPublic) {
            allOrganizations = organizationsWithUser.filter(organization => organization && organization.name.toLowerCase().includes(search.toLowerCase()));
        } else if (search) {
            allOrganizations = allOrganizations.filter(organization => organization && organization.name.toLowerCase().includes(search.toLowerCase()));
        }
        return allOrganizations;
    }
}