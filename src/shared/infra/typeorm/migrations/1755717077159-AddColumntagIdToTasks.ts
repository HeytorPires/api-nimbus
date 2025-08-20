import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddColumntagIdToTasks1755717077159 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "tasks",
      new TableColumn({
        name: 'tag_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'tasks',
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
    const table = await queryRunner.getTable('tasks');
    const foreignKey = table!.foreignKeys.find(fk => fk.name === 'tagsToTasks');
    if (foreignKey) {
      await queryRunner.dropForeignKey('tasks', foreignKey);
    }

    await queryRunner.dropColumn('tasks', 'tag_id');
  }
}
