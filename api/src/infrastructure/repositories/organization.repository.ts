import { Organization } from "@domain/entities/organization.entity";
import { OrganizationRole } from "@domain/entities/organization-role.entity";
import { OrganizationMember } from "@domain/entities/organization-member.entity";
import { IOrganizationRepository, IOrganizationRoleRepository, IOrganizationMemberRepository } from "@domain/repositories/organization.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
    constructor(
        @InjectRepository(Organization)
        private readonly typeOrmRepository: Repository<Organization>,
    ) {}

    async findById(id: string): Promise<Organization | null> {
        return this.typeOrmRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Organization[]> {
        return this.typeOrmRepository.find();
    }

    async listOrganizations(isPublic?: boolean): Promise<Organization[]> {
        let qb = this.typeOrmRepository.createQueryBuilder('organization');
        qb.select
        ([
            'organization.id',
            'organization.name',
            'organization.description',
            'organization.isActive',
            'organization.maxMembers',
            'organization.createdAt',
            'organization.updatedAt',
        ]);

        if (isPublic) {
            qb.where('organization.isPublic = :isPublic', { isPublic: true })
        }

        return await qb.getMany();
    }

    async create(organization: Partial<Organization>): Promise<Organization> {
        const newOrganization = this.typeOrmRepository.create(organization);
        return this.typeOrmRepository.save(newOrganization);
    }

    async save(organization: Organization): Promise<Organization> {
        return this.typeOrmRepository.save(organization);
    }

    async update(id: string, organization: Partial<Organization>): Promise<Organization> {
        await this.typeOrmRepository.update(id, organization);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Organization not found');
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.typeOrmRepository.delete(id);
    }
}

@Injectable()
export class OrganizationRoleRepository implements IOrganizationRoleRepository {
  constructor(
    @InjectRepository(OrganizationRole)
    private readonly typeOrmRepository: Repository<OrganizationRole>,
  ) {}

  async findById(id: string): Promise<OrganizationRole | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }


  async findByOrganizationId(organizationId: string): Promise<OrganizationRole[]> {
    return this.typeOrmRepository.find({
      where: { organizationId },
      relations: ['role', 'user'],
    });
  }


  async create(organizationRole: Partial<OrganizationRole>): Promise<OrganizationRole> {
    const newOrganizationRole = this.typeOrmRepository.create(organizationRole);
    return this.typeOrmRepository.save(newOrganizationRole);
  }

  async save(organizationRole: OrganizationRole): Promise<OrganizationRole> {
    return this.typeOrmRepository.save(organizationRole);
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.softDelete(id);
  }
}

@Injectable()
export class OrganizationMemberRepository implements IOrganizationMemberRepository {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly typeOrmRepository: Repository<OrganizationMember>,
  ) {}

  async findById(id: string): Promise<OrganizationMember | null> {
    return this.typeOrmRepository.findOne({
      where: { id },
      relations: ['user', 'organization'],
    });
  }

  async findByUserIdAndOrganizationId(
    userId: string,
    organizationId: string,
  ): Promise<OrganizationMember | null> {
    return this.typeOrmRepository.findOne({
      where: { userId, organizationId },
      relations: ['user', 'organization'],
    });
  }

  async findByOrganizationId(organizationId: string): Promise<OrganizationMember[]> {
    return this.typeOrmRepository.find({
      where: { organizationId },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<OrganizationMember[]> {
    return this.typeOrmRepository.find({
      where: { userId },
      relations: ['organization'],
    });
  }

  async findAll(): Promise<OrganizationMember[]> {
    return this.typeOrmRepository.find({
      relations: ['user', 'organization'],
    });
  }

  async listOrganizations(): Promise<OrganizationMember[]> {
    return this.findAll();
  }

  async create(organizationMember: Partial<OrganizationMember>): Promise<OrganizationMember> {
    const newMember = this.typeOrmRepository.create(organizationMember);
    return this.typeOrmRepository.save(newMember);
  }

  async save(organizationMember: OrganizationMember): Promise<OrganizationMember> {
    return this.typeOrmRepository.save(organizationMember);
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.softDelete(id);
  }

  async deleteByUserAndOrganization(userId: string, organizationId: string): Promise<void> {
    await this.typeOrmRepository.softDelete({ userId, organizationId });
  }
}