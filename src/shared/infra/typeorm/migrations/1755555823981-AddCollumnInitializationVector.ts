import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnInitializationVector1755555823981 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'tasks',
            new TableColumn({
                name: 'InitializationVector', // nome da coluna
                type: 'varchar',
                length: '32', // IV geralmente tem 16 bytes = 32 chars em hex
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('tasks', 'initialization_vector');
    }
}
