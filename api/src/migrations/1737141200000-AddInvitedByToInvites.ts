import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInvitedByToInvites1737141200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "invites" 
            ADD COLUMN "invitedBy" uuid NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "invites" 
            ADD CONSTRAINT "FK_invites_invitedBy" 
            FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "invites" 
            DROP CONSTRAINT "FK_invites_invitedBy"
        `);

        await queryRunner.query(`
            ALTER TABLE "invites" 
            DROP COLUMN "invitedBy"
        `);
    }
}
