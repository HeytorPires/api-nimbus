import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTableToTagId1769472895961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('projects', 'tag_id', 'tagId');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('projects', 'tagId', 'tag_Id');
  }
}

