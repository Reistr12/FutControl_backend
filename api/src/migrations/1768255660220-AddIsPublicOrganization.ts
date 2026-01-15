import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPublicOrganization1768255660220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "organizations" ADD COLUMN "isPublic" boolean NOT NULL DEFAULT false;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "organizations" DROP COLUMN "isPublic";
        `);
    }

}
