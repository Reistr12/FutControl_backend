import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMatchesTable1768861388074 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "organization_matches" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "organizationId" uuid NOT NULL,
                "maxPlayers" integer NOT NULL,
                "date" TIMESTAMP NOT NULL,
                "startTime" varchar NOT NULL,
                "endTime" varchar NOT NULL,
                "maxGuests" integer,
                "maxTeams" integer NOT NULL,
                "playersPerTeam" integer NOT NULL,
                "registrationOpenDate" TIMESTAMP NOT NULL,
                "registrationClosed" boolean NOT NULL DEFAULT false,
                "price" numeric(10,2),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_organization_matches" PRIMARY KEY ("id"),
                CONSTRAINT "FK_organization_matches_organizationId"
                FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "organization_matches"."id" IS 'Identificador único da partida';
            COMMENT ON COLUMN "organization_matches"."organizationId" IS 'ID da organização/pelada';
            COMMENT ON COLUMN "organization_matches"."maxPlayers" IS 'Número máximo de jogadores';
            COMMENT ON COLUMN "organization_matches"."date" IS 'Data da partida';
            COMMENT ON COLUMN "organization_matches"."startTime" IS 'Horário de início';
            COMMENT ON COLUMN "organization_matches"."endTime" IS 'Horário de término';
            COMMENT ON COLUMN "organization_matches"."maxGuests" IS 'Número máximo de convidados (opcional)';
            COMMENT ON COLUMN "organization_matches"."maxTeams" IS 'Quantidade máxima de times';
            COMMENT ON COLUMN "organization_matches"."playersPerTeam" IS 'Número de jogadores por time';
            COMMENT ON COLUMN "organization_matches"."registrationOpenDate" IS 'Data de abertura das inscrições';
            COMMENT ON COLUMN "organization_matches"."registrationClosed" IS 'Indica se as inscrições foram fechadas (manual ou por atingir limite)';
            COMMENT ON COLUMN "organization_matches"."price" IS 'Preço para convidados (membros com contrato mensal não pagam)';
            COMMENT ON COLUMN "organization_matches"."createdAt" IS 'Data de criação do registro';
            COMMENT ON COLUMN "organization_matches"."updatedAt" IS 'Data da última atualização';
            COMMENT ON COLUMN "organization_matches"."deletedAt" IS 'Data de exclusão lógica (soft delete)';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "organization_matches"`);
    }

}
