import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTasks1755221997757 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'tasks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'description',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'variablesEnvironment',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'repository',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'userId',
                    type: 'uuid',
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }), true);

        await queryRunner.createForeignKey('tasks', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('tasks');
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
        await queryRunner.dropForeignKey('tasks', foreignKey!);

        await queryRunner.dropTable('tasks');
    }
}

