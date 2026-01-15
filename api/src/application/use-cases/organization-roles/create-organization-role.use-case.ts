import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import type { IOrganizationRoleRepository } from '../../../domain/repositories/organization.repository.interface';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { CreateOrganizationRoleDto } from '../../dtos/create-organization-role.dto';
import { OrganizationRole } from '../../../domain/entities/organization-role.entity';

@Injectable()
export class CreateOrganizationRoleUseCase {
  constructor(
    @Inject('IOrganizationRoleRepository')
    private readonly organizationRoleRepository: IOrganizationRoleRepository,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(createDto: CreateOrganizationRoleDto, userId: string): Promise<OrganizationRole> {
    const [organization, user, role] = await Promise.all([
      this.organizationRepository.findById(createDto.organizationId),
      this.userRepository.findById(createDto.userId),
      this.roleRepository.findById(createDto.roleId),
    ]);

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (!role) {
      throw new NotFoundException('Role não encontrada');
    }

    const existing = await this.organizationRoleRepository.findByUserAndRoleAndOrganization(
      createDto.userId,
      createDto.roleId,
      createDto.organizationId,
    );

    if (existing) {
      throw new ConflictException('Role já atribuída a este usuário nesta organização');
    }

    return this.organizationRoleRepository.create(createDto);
  }
}

