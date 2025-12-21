import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnInitializationVector1755555823981
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'InitializationVector',
        type: 'varchar',
        length: '32',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('projects', 'InitializationVector');
  }
}

