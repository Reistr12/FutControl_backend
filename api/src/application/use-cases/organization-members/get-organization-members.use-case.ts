import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationMember } from '../../../domain/entities/organization-member.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class GetOrganizationMembersUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(organizationId: string, userId: string, params: { search?: string }): Promise<OrganizationMember[]> {
    const isMember = await this.organizationAccessService.verifyUserIsMember(userId, organizationId);

    if (!isMember) {
      throw new BadRequestException('Usuário não é membro desta organização');
    }

    const members = await this.organizationRepository.findMembersByOrganizationId(organizationId, params.search);
    return members
  }
}

