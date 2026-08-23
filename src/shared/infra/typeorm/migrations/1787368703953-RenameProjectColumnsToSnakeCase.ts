import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameProjectColumnsToSnakeCase1787368703953
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'projects',
      'variablesEnvironment',
      'variables_environment'
    );
    await queryRunner.renameColumn(
      'projects',
      'InitializationVector',
      'initialization_vector'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'projects',
      'initialization_vector',
      'InitializationVector'
    );
    await queryRunner.renameColumn(
      'projects',
      'variables_environment',
      'variablesEnvironment'
    );
  }
}
