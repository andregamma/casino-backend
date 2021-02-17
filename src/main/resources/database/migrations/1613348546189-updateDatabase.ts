import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateDatabase1613348546189 implements MigrationInterface {
  name = 'updateDatabase1613348546189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user_games` CHANGE `status` `status` enum ('active', 'canceled', 'finished') NULL DEFAULT 'active'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user_games` CHANGE `status` `status` enum ('active', 'canceled', 'finished') NULL DEFAULT 'active'",
    );
  }
}
