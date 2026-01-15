import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvitesTable1768255805645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "invites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "organizationId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "email" varchar(255) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_invites" PRIMARY KEY ("id"),
                CONSTRAINT "FK_invites_organizationId" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_invites_userId" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "invites";
        `);
    }
}
