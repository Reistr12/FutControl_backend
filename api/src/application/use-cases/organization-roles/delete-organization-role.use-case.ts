import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IOrganizationRoleRepository } from '../../../domain/repositories/organization.repository.interface';

@Injectable()
export class DeleteOrganizationRoleUseCase {
  constructor(
    @Inject('IOrganizationRoleRepository')
    private readonly organizationRoleRepository: IOrganizationRoleRepository,
  ) {}

  async execute(userId: string, roleId: string, organizationId: string, currentUserId: string): Promise<void> {
    
    const organizationRole = await this.organizationRoleRepository.findByUserAndRoleAndOrganization(
      userId,
      roleId,
      organizationId,
    );

    if (!organizationRole) {
      throw new NotFoundException('Role não encontrada para este usuário nesta organização');
    }

    await this.organizationRoleRepository.deleteByUserAndRoleAndOrganization(
      userId,
      roleId,
      organizationId,
    );
  }
}

