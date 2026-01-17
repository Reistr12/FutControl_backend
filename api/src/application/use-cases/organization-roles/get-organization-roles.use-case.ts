import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationRole } from '../../../domain/entities/organization-role.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class GetOrganizationRolesUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(organizationId: string, userId: string): Promise<OrganizationRole[]> {
    // Validação de parâmetros
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!organizationId) {
      throw new BadRequestException('ID da organização é obrigatório');
    }

    // Verifica se o usuário é membro da organização
    await this.organizationAccessService.verifyUserIsMember(userId, organizationId);
    return this.organizationRepository.findRolesByOrganizationId(organizationId);
  }
}

