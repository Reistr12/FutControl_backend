import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IOrganizationMemberRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class DeleteOrganizationMemberUseCase {
  constructor(
    @Inject('IOrganizationMemberRepository')
    private readonly organizationMemberRepository: IOrganizationMemberRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(userId: string, organizationId: string, currentUserId: string): Promise<void> {
    // Verifica se o usuário tem permissão de admin
    await this.organizationAccessService.verifyUserHasRole(currentUserId, organizationId, 'admin');
    
    const member = await this.organizationMemberRepository.findByUserIdAndOrganizationId(
      userId,
      organizationId,
    );

    if (!member) {
      throw new NotFoundException('Membro não encontrado nesta organização');
    }

    await this.organizationMemberRepository.deleteByUserAndOrganization(userId, organizationId);
  }
}

