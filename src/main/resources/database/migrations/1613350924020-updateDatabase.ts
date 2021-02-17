import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateDatabase1613350924020 implements MigrationInterface {
  name = 'updateDatabase1613350924020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sports_bets` DROP FOREIGN KEY `sports_bets_sports_matches_id_fk`',
    );
    await queryRunner.query(
      'ALTER TABLE `sports_bets` DROP FOREIGN KEY `sports_bets_user_id_fk`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `user_server_permissions_ranks_id_fk`',
    );
    await queryRunner.query(
      'ALTER TABLE `site_config` ADD `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT',
    );
    await queryRunner.query(
      'ALTER TABLE `session` DROP FOREIGN KEY `FK_30e98e8746699fb9af235410aff`',
    );
    await queryRunner.query(
      'ALTER TABLE `session` CHANGE `user_id` `user_id` int NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `sports_matches` CHANGE `status` `status` enum ('active', 'disabled', 'finished') NOT NULL DEFAULT 'active'",
    );
    await queryRunner.query('ALTER TABLE `user` CHANGE `rank` `rank` int NULL');
    await queryRunner.query(
      "ALTER TABLE `user_games` CHANGE `status` `status` enum ('active', 'canceled', 'finished') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      "ALTER TABLE `site_config` CHANGE `status` `status` enum ('active', 'disabled') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      'CREATE INDEX `sports_bets_user_id_fk` ON `sports_bets` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `sports_bets_sports_matches_id_fk` ON `sports_bets` (`match_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `user_server_permissions_ranks_id_fk` ON `user` (`rank`)',
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_30e98e8746699fb9af235410aff` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `sports_bets` ADD CONSTRAINT `FK_309779d76029b2b44ef6acbdc93` FOREIGN KEY (`match_id`) REFERENCES `sports_matches`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `sports_bets` ADD CONSTRAINT `FK_30375aed0cf070a2a16ad210b82` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_15478618db3cf9f17a0e175e779` FOREIGN KEY (`rank`) REFERENCES `server_permissions_ranks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_15478618db3cf9f17a0e175e779`',
    );
    await queryRunner.query(
      'ALTER TABLE `sports_bets` DROP FOREIGN KEY `FK_30375aed0cf070a2a16ad210b82`',
    );
    await queryRunner.query(
      'ALTER TABLE `sports_bets` DROP FOREIGN KEY `FK_309779d76029b2b44ef6acbdc93`',
    );
    await queryRunner.query(
      'ALTER TABLE `session` DROP FOREIGN KEY `FK_30e98e8746699fb9af235410aff`',
    );
    await queryRunner.query(
      'DROP INDEX `user_server_permissions_ranks_id_fk` ON `user`',
    );
    await queryRunner.query(
      'DROP INDEX `sports_bets_sports_matches_id_fk` ON `sports_bets`',
    );
    await queryRunner.query(
      'DROP INDEX `sports_bets_user_id_fk` ON `sports_bets`',
    );
    await queryRunner.query(
      "ALTER TABLE `site_config` CHANGE `status` `status` enum ('active', 'disabled') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      "ALTER TABLE `user_games` CHANGE `status` `status` enum ('active', 'canceled', 'finished') NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `rank` `rank` int NOT NULL DEFAULT '1'",
    );
    await queryRunner.query(
      "ALTER TABLE `sports_matches` CHANGE `status` `status` enum ('active', 'disabled', 'finished') NOT NULL DEFAULT 'active'",
    );
    await queryRunner.query(
      'ALTER TABLE `session` CHANGE `user_id` `user_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_30e98e8746699fb9af235410aff` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query('ALTER TABLE `site_config` DROP COLUMN `id`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `user_server_permissions_ranks_id_fk` FOREIGN KEY (`rank`) REFERENCES `server_permissions_ranks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `sports_bets` ADD CONSTRAINT `sports_bets_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `sports_bets` ADD CONSTRAINT `sports_bets_sports_matches_id_fk` FOREIGN KEY (`match_id`) REFERENCES `sports_matches`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
