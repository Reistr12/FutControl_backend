import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationAccessService } from '../../services/organization-access.service';
import { OrganizationRoleService } from '@application/services/organization-role.service';

@Injectable()
export class DeleteOrganizationMemberUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
    private readonly organizationRoleService: OrganizationRoleService,
  ) {}

  async execute(userId: string, organizationId: string, currentUserId: string): Promise<void> {
    await this.organizationAccessService.verifyUserHasRole(currentUserId, organizationId, 'admin');
    
    const member = await this.organizationRepository.findMemberByUserIdAndOrganizationId(
      userId,
      organizationId,
    );

    if (!member) {
      throw new NotFoundException('Membro não encontrado nesta organização');
    }

    const memberOrganizationRole = await this.organizationRoleService.deleteOrganizationRole(
      member.id,
      organizationId,
      member.organizationRole.roleId
    );

    if (memberOrganizationRole !== null) {
      return await this.organizationRepository.deleteMemberByUserAndOrganization(userId, organizationId);
    } else {
      throw new NotFoundException('Role do membro não encontrada nesta organização');
    }
  }
}

