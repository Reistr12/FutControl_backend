import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMatchPlayerSupport1768870000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar campo teamsDrawn na tabela organization_matches
        await queryRunner.query(`
            ALTER TABLE "organization_matches"
            ADD COLUMN "teamsDrawn" boolean NOT NULL DEFAULT false
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "organization_matches"."teamsDrawn" IS 'Indica se o sorteio dos times já foi realizado';
        `);

        // Criar tabela match_players
        await queryRunner.query(`
            CREATE TABLE "match_players" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "matchId" uuid NOT NULL,
                "memberId" uuid,
                "teamNumber" integer,
                "isGuest" boolean NOT NULL DEFAULT false,
                "guestName" varchar,
                "guestEmail" varchar,
                "hasPaid" boolean NOT NULL DEFAULT false,
                "paymentMethod" varchar,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_match_players" PRIMARY KEY ("id"),
                CONSTRAINT "FK_match_players_matchId"
                FOREIGN KEY ("matchId") REFERENCES "organization_matches"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_match_players_memberId"
                FOREIGN KEY ("memberId") REFERENCES "organization_members"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN "match_players"."id" IS 'Identificador único da inscrição';
            COMMENT ON COLUMN "match_players"."matchId" IS 'ID da partida';
            COMMENT ON COLUMN "match_players"."memberId" IS 'ID do membro da organização (null para convidados)';
            COMMENT ON COLUMN "match_players"."teamNumber" IS 'Número do time após sorteio (1, 2, 3...)';
            COMMENT ON COLUMN "match_players"."isGuest" IS 'Indica se é convidado (não membro)';
            COMMENT ON COLUMN "match_players"."guestName" IS 'Nome do convidado';
            COMMENT ON COLUMN "match_players"."guestEmail" IS 'Email do convidado';
            COMMENT ON COLUMN "match_players"."hasPaid" IS 'Indica se o pagamento foi realizado';
            COMMENT ON COLUMN "match_players"."paymentMethod" IS 'Forma de pagamento (PIX, Dinheiro, Cartão, etc)';
            COMMENT ON COLUMN "match_players"."createdAt" IS 'Data de inscrição';
            COMMENT ON COLUMN "match_players"."updatedAt" IS 'Data da última atualização';
            COMMENT ON COLUMN "match_players"."deletedAt" IS 'Data de exclusão lógica (soft delete)';
        `);

        // Criar índices para performance
        await queryRunner.query(`
            CREATE INDEX "IDX_match_players_matchId" ON "match_players" ("matchId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_match_players_memberId" ON "match_players" ("memberId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_match_players_guestEmail" ON "match_players" ("guestEmail")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_organization_matches_date_teamsDrawn" 
            ON "organization_matches" ("date", "teamsDrawn")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_organization_matches_date_teamsDrawn"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_match_players_guestEmail"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_match_players_memberId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_match_players_matchId"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "match_players"`);
        await queryRunner.query(`ALTER TABLE "organization_matches" DROP COLUMN "teamsDrawn"`);
    }

}
