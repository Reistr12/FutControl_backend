import { Invite } from "@domain/entities/invite.entity";

export interface IInviteRepository {
    findById(id: string): Promise<Invite | null>;
    findByOrganizationId(organizationId: string): Promise<Invite[]>;
    findByUserId(userId: string): Promise<Invite[]>;
    acceptInvite(id: string): Promise<Invite>;
    create(organizationId: string, userId: string, email: string, invitedBy: string): Promise<Invite>;
    save(invite: Invite): Promise<Invite>;
    delete(id: string): Promise<void>;
}