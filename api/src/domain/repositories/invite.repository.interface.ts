import { Invite } from "@domain/entities/invite.entity";

export interface IIvinteRepository {
    findByOrganizationId(organizationId: string): Promise<Invite[]>;
    responseToInvite(invite: Invite, accept: boolean): Promise<void>;
    create(invite: Partial<Invite>): Promise<Invite>;
    save(invite: Invite): Promise<Invite>;
    delete(id: string): Promise<void>;
}