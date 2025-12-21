import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddColumntagIdToTasks1755717077159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'projects',
      new TableColumn({
        name: 'tag_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'projects',
      new TableForeignKey({
        name: 'tagsToTasks',
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('projects');
    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.name === 'tagsToTasks'
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('projects', foreignKey);
    }

    await queryRunner.dropColumn('projects', 'tag_id');
  }
}

