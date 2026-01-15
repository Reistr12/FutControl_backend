import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { CreateOrganizationDto } from '../../dtos/create-organization.dto';
import { Organization } from '../../../domain/entities/organization.entity';
import { CurrentUserData } from '@infrastructure/decorators/current-user.decorator';
import { CreateOrganizationMemberUseCase } from '../organization-members/create-organization-member.use-case';  
import { CreateOrganizationRoleUseCase } from '../organization-roles/create-organization-role.use-case';
import { GetRoleByNameUseCase } from '../roles/get-role-by-name.use-case';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationMemberUsecase: CreateOrganizationMemberUseCase,
    private readonly organizationRoleUsecase: CreateOrganizationRoleUseCase,
    private readonly getRoleByNameUseCase: GetRoleByNameUseCase,
  ) {}

  async execute(createDto: CreateOrganizationDto, user: CurrentUserData): Promise<Organization> {
    const organization = await this.organizationRepository.create({
      name: createDto.name,
      description: createDto.description,
      isActive: createDto.isActive ?? true,
      maxMembers: createDto.maxMembers,
    });

    const role = await this.getRoleByNameUseCase.execute('admin');
    
    await this.organizationMemberUsecase.execute(
      {
        organizationId: organization.id,
        userId: user.id,
      },
      user.id,
    );

    await this.organizationRoleUsecase.execute(
      {
        organizationId: organization.id,
        userId: user.id,
        roleId: role.id,
      },
      user.id,
    );

    return organization;
  }
}
