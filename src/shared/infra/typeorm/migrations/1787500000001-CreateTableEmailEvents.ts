import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTableEmailEvents1787500000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'source',
            type: 'varchar',
          },
          {
            name: 'provider_event_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'payload',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'occurred_at',
            type: 'timestamp',
          },
        ],
      })
    );

    // Único: o mesmo evento reenviado pelo provedor não duplica o histórico.
    await queryRunner.createIndex(
      'email_events',
      new TableIndex({
        name: 'EmailEventsProviderEvent',
        columnNames: ['provider_event_id'],
        isUnique: true,
      })
    );

    await queryRunner.createForeignKey(
      'email_events',
      new TableForeignKey({
        name: 'EmailEventsEmail',
        columnNames: ['email_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'emails',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('email_events', 'EmailEventsEmail');
    await queryRunner.dropIndex('email_events', 'EmailEventsProviderEvent');
    await queryRunner.dropTable('email_events');
  }
}
