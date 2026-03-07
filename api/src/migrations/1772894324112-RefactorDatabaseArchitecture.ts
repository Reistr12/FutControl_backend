import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorDatabaseArchitecture1772894324112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Users - adicionar soft delete e campos de auditoria
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at"`);

        // 2. Organizations - adicionar campos de auditoria e renomear colunas
        await queryRunner.query(`ALTER TABLE "organizations" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "deletedAt" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "isActive" TO "is_active"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "isPublic" TO "is_public"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "maxMembers" TO "max_members"`);
        await queryRunner.query(`ALTER TABLE "organizations" ALTER COLUMN "description" TYPE text`);

        // 3. Roles - adicionar description e campos de auditoria
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "description" text`);
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "deletedAt" TO "deleted_at"`);

        // 4. Organization Members - adicionar campos de auditoria e renomear colunas
        await queryRunner.query(`ALTER TABLE "organization_members" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "organizationId" TO "organization_id"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "deletedAt" TO "deleted_at"`);

        // 5. Organization Roles -> Organization Member Roles (remover organizationId redundante)
        await queryRunner.query(`ALTER TABLE "organization_roles" RENAME TO "organization_member_roles"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" DROP CONSTRAINT "FK_organization_roles_organizationId"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "memberId" TO "organization_member_id"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "roleId" TO "role_id"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "deletedAt" TO "deleted_at"`);

        // 6. Invites - adicionar campos de auditoria e renomear colunas
        await queryRunner.query(`ALTER TABLE "invites" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "invites" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "invites" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "organizationId" TO "organization_id"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "invitedBy" TO "invited_by"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "deletedAt" TO "deleted_at"`);

        // 7. Organization Matches -> Matches (simplificar estrutura)
        await queryRunner.query(`ALTER TABLE "organization_matches" RENAME TO "matches"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "registrationOpenDate"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "registrationClosed"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "teamsDrawn"`);
        await queryRunner.query(`ALTER TABLE "matches" ADD COLUMN "schedule" TIMESTAMP NOT NULL DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "matches" ADD COLUMN "start_at" TIMESTAMP NOT NULL DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "matches" ADD COLUMN "end_at" TIMESTAMP NOT NULL DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "matches" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "matches" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "matches" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "organizationId" TO "organization_id"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "maxPlayers" TO "max_players"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "maxGuests" TO "max_guests"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "maxTeams" TO "max_teams"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "playersPerTeam" TO "players_per_team"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "deletedAt" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "max_guests" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "price" SET NOT NULL`);

        // 8. Match Players - simplificar com enum type
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "teamNumber"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "isGuest"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "guestEmail"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "hasPaid"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`CREATE TYPE "player_type_enum" AS ENUM ('MEMBER', 'GUEST')`);
        await queryRunner.query(`ALTER TABLE "match_players" ADD COLUMN "type" "player_type_enum" NOT NULL DEFAULT 'MEMBER'`);
        await queryRunner.query(`ALTER TABLE "match_players" ADD COLUMN "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "match_players" ADD COLUMN "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "match_players" ADD COLUMN "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "matchId" TO "match_id"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "memberId" TO "organization_member_id"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "guestName" TO "guest_name"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "deletedAt" TO "deleted_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter na ordem inversa
        
        // Match Players
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "guest_name" TO "guestName"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "organization_member_id" TO "memberId"`);
        await queryRunner.query(`ALTER TABLE "match_players" RENAME COLUMN "match_id" TO "matchId"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "match_players" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "player_type_enum"`);

        // Matches
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "players_per_team" TO "playersPerTeam"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "max_teams" TO "maxTeams"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "max_guests" TO "maxGuests"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "max_players" TO "maxPlayers"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME COLUMN "organization_id" TO "organizationId"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "end_at"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "start_at"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "schedule"`);
        await queryRunner.query(`ALTER TABLE "matches" RENAME TO "organization_matches"`);

        // Invites
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "invited_by" TO "invitedBy"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "invites" RENAME COLUMN "organization_id" TO "organizationId"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "created_by"`);

        // Organization Member Roles
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "role_id" TO "roleId"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME COLUMN "organization_member_id" TO "memberId"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "organization_member_roles" RENAME TO "organization_roles"`);

        // Organization Members
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "organization_members" RENAME COLUMN "organization_id" TO "organizationId"`);
        await queryRunner.query(`ALTER TABLE "organization_members" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "organization_members" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "organization_members" DROP COLUMN "created_by"`);

        // Roles
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "description"`);

        // Organizations
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "max_members" TO "maxMembers"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "is_public" TO "isPublic"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "is_active" TO "isActive"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "created_by"`);

        // Users
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    }

}
