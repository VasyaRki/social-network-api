import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGeneratedMigrations1717359729827
  implements MigrationInterface
{
  name = 'AutoGeneratedMigrations1717359729827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('User', 'Admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_authprovider_enum" AS ENUM('Google', 'Facebook')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying,
        "phone" character varying,
        "hashedPassword" character varying,
        "username" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "role" "public"."user_role_enum" NOT NULL,
        "authProvider" "public"."user_authprovider_enum" NOT NULL,
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"),
        CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
