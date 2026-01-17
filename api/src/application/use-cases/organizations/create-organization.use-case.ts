import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { CreateOrganizationDto } from '../../dtos/create-organization.dto';
import { Organization } from '../../../domain/entities/organization.entity';
import { CurrentUserData } from '@infrastructure/decorators/current-user.decorator';
import { CreateOrganizationMemberUseCase } from '../organization-members/create-organization-member.use-case';  
import { MemberRoleEnum } from '@application/dtos/create-organization-member.dto';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationMemberUsecase: CreateOrganizationMemberUseCase,
  ) {}

  async execute(createDto: CreateOrganizationDto, user: CurrentUserData): Promise<Organization> {
    const organization = await this.organizationRepository.create({
      name: createDto.name,
      description: createDto.description,
      isActive: createDto.isActive ?? true,
      maxMembers: createDto.maxMembers,
      isPublic: createDto.isPublic ?? false,
    });

    if (!organization) {
      throw new Error('Erro ao criar organização');
    }

    await this.organizationMemberUsecase.execute(
      {
        organizationId: organization.id,
        userId: user.id,
        memberRole: MemberRoleEnum.ADMIN
      },
      user.id,
    );

    return organization;
  }
}
