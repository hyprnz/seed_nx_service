import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventTable1731633388497 implements MigrationInterface {
    name = 'CreateEventTable1731633388497';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "subject" text NOT NULL, "subjectName" text NOT NULL, "name" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "event"`);
    }
}
