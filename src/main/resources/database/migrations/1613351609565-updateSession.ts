import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSession1613351609565 implements MigrationInterface {
  name = 'updateSession1613351609565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `session` CHANGE `user_id` `user_id` int NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `sports_matches` CHANGE `status` `status` enum ('active', 'disabled', 'finished') NOT NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      "ALTER TABLE `user_games` CHANGE `status` `status` enum ('active', 'canceled', 'finished') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      "ALTER TABLE `site_config` CHANGE `status` `status` enum ('active', 'disabled') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_30e98e8746699fb9af235410aff` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `site_config` CHANGE `status` `status` enum ('active', 'disabled') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      "ALTER TABLE `user_games` CHANGE `status` `status` enum ('active', 'canceled', 'finished') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      "ALTER TABLE `sports_matches` CHANGE `status` `status` enum ('active', 'disabled', 'finished') NOT NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      'ALTER TABLE `session` CHANGE `user_id` `user_id` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_30e98e8746699fb9af235410aff` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
