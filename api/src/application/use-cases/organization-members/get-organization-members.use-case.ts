import { Injectable, Inject } from '@nestjs/common';
import type { IOrganizationMemberRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationMember } from '../../../domain/entities/organization-member.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class GetOrganizationMembersUseCase {
  constructor(
    @Inject('IOrganizationMemberRepository')
    private readonly organizationMemberRepository: IOrganizationMemberRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(organizationId: string, userId: string): Promise<OrganizationMember[]> {

    await this.organizationAccessService.verifyUserIsMember(userId, organizationId);

    const organizationMembers = await this.organizationMemberRepository.findByOrganizationId(organizationId);

    return organizationMembers;
  }
}

