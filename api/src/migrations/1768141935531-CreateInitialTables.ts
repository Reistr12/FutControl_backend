import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1768141935531 implements MigrationInterface {
    name = 'CreateInitialTables1768141935531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_roles" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "maxMembers" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_56a9cd1d59fc133e6078f576b92" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "organization_members" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "organizationId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_organization_members" PRIMARY KEY ("id"),
                CONSTRAINT "FK_organization_members_organizationId" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_organization_members_userId" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
                CONSTRAINT "UQ_user_organization" UNIQUE ("userId", "organizationId")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "organization_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "memberId" uuid NOT NULL,
                "roleId" uuid NOT NULL,
                "organizationId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_organization_roles" PRIMARY KEY ("id"),
                CONSTRAINT "FK_organization_roles_memberId" FOREIGN KEY ("memberId") REFERENCES "organization_members" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_organization_roles_roleId" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_organization_roles_organizationId" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE,
                CONSTRAINT "UQ_member_role_organization" UNIQUE ("memberId", "roleId", "organizationId")
            )
        `);

        // Inserir roles iniciais
        await queryRunner.query(`
            INSERT INTO "roles" ("id", "name", "createdAt", "updatedAt")
            VALUES 
                ('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'admin', NOW(), NOW()),
                ('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'member', NOW(), NOW())
            ON CONFLICT DO NOTHING
        `);

        // Inserir usuários iniciais (senhas são hash de "senha123" usando bcrypt com salt rounds 10)
        // Hash de "senha123": $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
        await queryRunner.query(`
            INSERT INTO "users" ("id", "email", "password", "name", "createdAt", "updatedAt")
            VALUES 
                ('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'admin@futcontrol.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin FutControl', NOW(), NOW()),
                ('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'member1@futcontrol.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Membro 1', NOW(), NOW()),
                ('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'member2@futcontrol.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Membro 2', NOW(), NOW())
            ON CONFLICT ("email") DO NOTHING
        `);

        // Inserir organização inicial
        await queryRunner.query(`
            INSERT INTO "organizations" ("id", "name", "description", "isActive", "maxMembers", "createdAt", "updatedAt")
            VALUES 
                ('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'Pelada dos Amigos', 'Grupo de amigos que se reúnem para jogar futebol', true, 20, NOW(), NOW())
            ON CONFLICT DO NOTHING
        `);

        // Inserir membros na organização (incluindo o admin)
        // A role de cada membro estará em organization_roles
        await queryRunner.query(`
            INSERT INTO "organization_members" ("id", "organizationId", "userId", "createdAt", "updatedAt")
            VALUES 
                ('d0e1f2a3-b4c5-4567-d89a-bcdef0123456', 'f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'c3d4e5f6-a7b8-4901-c234-56789abcdef0', NOW(), NOW()),
                ('e1f2a3b4-c5d6-5678-e9ab-cdef01234567', 'f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'd4e5f6a7-b8c9-4012-d345-6789abcdef01', NOW(), NOW()),
                ('f2a3b4c5-d6e7-6789-fabc-def012345678', 'f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'e5f6a7b8-c9d0-4123-e456-789abcdef012', NOW(), NOW())
            ON CONFLICT ("userId", "organizationId") DO NOTHING
        `);

        // Inserir relacionamentos em organization_roles
        // Admin: primeiro membro como admin da organização
        // Members: outros dois membros como members da organização
        await queryRunner.query(`
            INSERT INTO "organization_roles" ("id", "memberId", "roleId", "organizationId", "createdAt", "updatedAt")
            VALUES 
                ('a7b8c9d0-e1f2-4345-a678-9abcdef01234', 'd0e1f2a3-b4c5-4567-d89a-bcdef0123456', 'a1b2c3d4-e5f6-4789-a012-3456789abcde', 'f6a7b8c9-d0e1-4234-f567-89abcdef0123', NOW(), NOW()),
                ('b8c9d0e1-f2a3-4456-b789-abcdef012345', 'e1f2a3b4-c5d6-5678-e9ab-cdef01234567', 'b2c3d4e5-f6a7-4890-b123-456789abcdef', 'f6a7b8c9-d0e1-4234-f567-89abcdef0123', NOW(), NOW()),
                ('c9d0e1f2-a3b4-4567-c89a-bcdef0123456', 'f2a3b4c5-d6e7-6789-fabc-def012345678', 'b2c3d4e5-f6a7-4890-b123-456789abcdef', 'f6a7b8c9-d0e1-4234-f567-89abcdef0123', NOW(), NOW())
            ON CONFLICT ("memberId", "roleId", "organizationId") DO NOTHING
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "organization_roles"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "organization_members"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "organizations"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }

}
