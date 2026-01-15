import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationToOrganizations1768255648419 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "organizations" ADD COLUMN "location" varchar(255);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "organizations" DROP COLUMN "location";
        `);
    }

}
