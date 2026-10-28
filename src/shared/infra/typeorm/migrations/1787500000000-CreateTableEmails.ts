import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTableEmails1787500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'emails',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'provider_message_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'varchar',
          },
          {
            name: 'recipient',
            type: 'varchar',
          },
          {
            name: 'subject',
            type: 'varchar',
          },
          {
            name: 'template',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // O webhook busca o email por este id, então precisa de índice.
    await queryRunner.createIndex(
      'emails',
      new TableIndex({
        name: 'EmailsProviderMessage',
        columnNames: ['provider', 'provider_message_id'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('emails', 'EmailsProviderMessage');
    await queryRunner.dropTable('emails');
  }
}
