import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTasksTableToProjects1755717077160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" RENAME TO "projects"`);
    await queryRunner.query(`ALTER TABLE "projects" RENAME CONSTRAINT "TasksUser" TO "ProjectsUser"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" RENAME CONSTRAINT "ProjectsUser" TO "TasksUser"`);
    await queryRunner.query(`ALTER TABLE "projects" RENAME TO "tasks"`);
  }
}
