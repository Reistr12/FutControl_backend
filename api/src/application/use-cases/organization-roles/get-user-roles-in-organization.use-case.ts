import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationRole } from '../../../domain/entities/organization-role.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class GetUserRolesInOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(userId: string, organizationId: string, currentUserId: string): Promise<OrganizationRole[]> {
    // Validação de parâmetros
    if (!currentUserId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!organizationId) {
      throw new BadRequestException('ID da organização é obrigatório');
    }

    if (!userId) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    // Verifica se o usuário atual é membro da organização
    await this.organizationAccessService.verifyUserIsMember(currentUserId, organizationId);

    // Busca as roles do usuário especificado na organização
    const userRoles = await this.organizationRepository.findRolesByUserIdAndOrganizationId(
      userId,
      organizationId,
    );

    return userRoles || [];
  }
}

