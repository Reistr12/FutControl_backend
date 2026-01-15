import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    
    const isMember = await this.organizationAccessService.verifyUserHasRole(userId, id, 'admin');
    if (!isMember) {
      throw new ForbiddenException('Usuário não tem permissão para deletar esta organização');
    }
    
    await this.organizationRepository.delete(id);
  }
}

