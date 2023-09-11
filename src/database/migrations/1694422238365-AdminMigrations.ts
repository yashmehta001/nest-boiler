import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminMigrations1694422238365 implements MigrationInterface {
  name = 'AdminMigrations1694422238365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" SERIAL NOT NULL, "first_name" character varying, "last_name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de87485f6489f5d0995f584195" ON "admin" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_de87485f6489f5d0995f584195"`,
    );
    await queryRunner.query(`DROP TABLE "admin"`);
  }
}
