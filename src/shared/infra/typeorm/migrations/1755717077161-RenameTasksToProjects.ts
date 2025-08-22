import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class RenameTasksToProjects1755717077161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get existing table with its foreign keys
    const table = await queryRunner.getTable('tasks');
    if (!table) {
      return;
    }

    // Store all foreign keys
    const foreignKeys = table.foreignKeys;

    // Drop all foreign keys
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('tasks', foreignKey);
    }

    // Rename the table
    await queryRunner.renameTable('tasks', 'projects');

    // Recreate foreign keys with new names for the projects table
    for (const foreignKey of foreignKeys) {
      const newForeignKey = new TableForeignKey({
        name: `FK_${foreignKey.columnNames[0]}_projects_${foreignKey.referencedTableName}`,
        columnNames: foreignKey.columnNames,
        referencedColumnNames: foreignKey.referencedColumnNames,
        referencedTableName: foreignKey.referencedTableName,
        onDelete: foreignKey.onDelete,
        onUpdate: foreignKey.onUpdate
      });
      await queryRunner.createForeignKey('projects', newForeignKey);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get existing table with its foreign keys
    const table = await queryRunner.getTable('projects');
    if (!table) {
      return;
    }

    // Store all foreign keys
    const foreignKeys = table.foreignKeys;

    // Drop all foreign keys
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('projects', foreignKey);
    }

    // Rename table back
    await queryRunner.renameTable('projects', 'tasks');

    // Recreate foreign keys with original names for the tasks table
    for (const foreignKey of foreignKeys) {
      const newForeignKey = new TableForeignKey({
        name: `FK_${foreignKey.columnNames[0]}_tasks_${foreignKey.referencedTableName}`,
        columnNames: foreignKey.columnNames,
        referencedColumnNames: foreignKey.referencedColumnNames,
        referencedTableName: foreignKey.referencedTableName,
        onDelete: foreignKey.onDelete,
        onUpdate: foreignKey.onUpdate
      });
      await queryRunner.createForeignKey('tasks', newForeignKey);
    }
  }
}
