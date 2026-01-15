import { Invite } from "@domain/entities/invite.entity";
import { OrganizationMember } from "@domain/entities/organization-member.entity";
import { OrganizationRole } from "@domain/entities/organization-role.entity";
import { IIvinteRepository } from "@domain/repositories/invite.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository, Transaction } from "typeorm";

@Injectable()
export class InviteRepository implements IIvinteRepository {
    constructor(
        @InjectRepository(Invite)
        private readonly typeOrmRepository: Repository<Invite>,
        private readonly organizationMemberRepository: Repository<OrganizationMember>,
        private readonly organizationRoleRepository: Repository<OrganizationRole>,
    ) {}

    async findByOrganizationId(organizationId: string): Promise<Invite[]> {
        return this.typeOrmRepository.find({
            where: { organizationId },
            relations: ['organization', 'user'],
        });
    }

    async responseToInvite(invite: Invite, accept: boolean): Promise<void> {
        if (accept) {
            const newMember = new OrganizationMember() 
            newMember.id = randomUUID()
            newMember.userId = invite.userId;
            newMember.organizationId = invite.organizationId;
            await this.organizationMemberRepository.save(newMember);

            const organizationRole = new OrganizationRole()
            organizationRole.id = randomUUID()
            organizationRole.organizationId = invite.organizationId;
            organizationRole.memberId = newMember.id;
            organizationRole.roleId = 'b2c3d4e5-f6a7-4890-b123-456789abcdef';
            await this.organizationRoleRepository.manager.save(organizationRole);
        } else {
            await this.typeOrmRepository.softDelete(invite);
        }
    }

    async create(invite: Partial<Invite>): Promise<Invite> {
        const newInvite = this.typeOrmRepository.create(invite);
        return this.typeOrmRepository.save(newInvite);
    }

    async save(invite: Invite): Promise<Invite> {
        return this.typeOrmRepository.save(invite);
    }

    async delete(id: string): Promise<void> {
        const invite = await this.typeOrmRepository.findOneBy({ id });
        if (invite) {
            await this.typeOrmRepository.remove(invite);
        }
    }
}