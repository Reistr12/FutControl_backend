import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcceptInInviteTable1768673461436 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" ADD COLUMN IF NOT EXISTS "accepted" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN IF EXISTS "accepted"`);
    }

}
