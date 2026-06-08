import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTableToTagId1769472895961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // No-op: column already named tag_id
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op
  }
}

