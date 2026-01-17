import { Invite } from "@domain/entities/invite.entity";
import { OrganizationMember } from "@domain/entities/organization-member.entity";
import { OrganizationRole } from "@domain/entities/organization-role.entity";
import { IInviteRepository } from "@domain/repositories/invite.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { In, Repository, Transaction } from "typeorm";

@Injectable()
export class InviteRepository implements IInviteRepository {
    constructor(
        @InjectRepository(Invite)
        private readonly typeOrmRepository: Repository<Invite>,
        @InjectRepository(OrganizationMember)
        private readonly organizationMemberRepository: Repository<OrganizationMember>,
        @InjectRepository(OrganizationRole)
        private readonly organizationRoleRepository: Repository<OrganizationRole>,
    ) {}
    
    async findById(id: string): Promise<Invite | null> {
        return this.typeOrmRepository.findOneBy({ id });
    }
    
    async findByOrganizationId(organizationId: string): Promise<Invite[]> {
        return this.typeOrmRepository.find({
            where: { 
                organizationId,
                deletedAt: null as any
            },
        });
    }

    async findByUserId(userId: string): Promise<Invite[]> {
        return this.typeOrmRepository.find({
            where: { 
                userId,
                deletedAt: null as any
            },
            relations: ['organization'],
        });
    }

    async acceptInvite(idInvite:string): Promise<Invite> {
        const invite =  await this.typeOrmRepository.findOneBy({ id: idInvite });
        if (!invite) {
            throw new Error('Invite not found');
        }
        invite.accepted = true;
        invite.deletedAt = new Date();
        await this.typeOrmRepository.save(invite)
        
        return invite;
    }

    async create(organizationId: string, userId: string, email: string, invitedBy: string): Promise<Invite> {
        const newInvite = new Invite();
        newInvite.organizationId = organizationId;
        newInvite.userId = userId;
        newInvite.email = email;
        newInvite.invitedBy = invitedBy;
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