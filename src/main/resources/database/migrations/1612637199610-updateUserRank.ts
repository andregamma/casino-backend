import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUserRank1612637199610 implements MigrationInterface {
  name = 'updateUserRank1612637199610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `user_games` (`id` int NOT NULL AUTO_INCREMENT, `user_id` int NOT NULL, `game_id` int NOT NULL, `room_id` int NULL, `status` enum ('active', 'canceled', 'finished') NULL DEFAULT 'active', UNIQUE INDEX `user_games_user_id_game_id_room_id_uindex` (`user_id`, `game_id`, `room_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `room_events` (`id` int NOT NULL AUTO_INCREMENT, `event_name` varchar(255) NOT NULL, `event_json` json NOT NULL, `user_games_id` int NOT NULL, INDEX `room_events_user_games_id_fk` (`user_games_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_30e98e8746699fb9af235410aff` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_cace4a159ff9f2512dd42373760` FOREIGN KEY (`id`) REFERENCES `server_permissions_ranks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_games` ADD CONSTRAINT `FK_9432b81f913c6e29e5391038981` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `room_events` ADD CONSTRAINT `FK_f63b7283ab483fb52cd16d07036` FOREIGN KEY (`user_games_id`) REFERENCES `user_games`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `room_events` DROP FOREIGN KEY `FK_f63b7283ab483fb52cd16d07036`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_games` DROP FOREIGN KEY `FK_9432b81f913c6e29e5391038981`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_cace4a159ff9f2512dd42373760`',
    );
    await queryRunner.query(
      'ALTER TABLE `session` DROP FOREIGN KEY `FK_30e98e8746699fb9af235410aff`',
    );
    await queryRunner.query(
      'DROP INDEX `room_events_user_games_id_fk` ON `room_events`',
    );
    await queryRunner.query('DROP TABLE `room_events`');
    await queryRunner.query(
      'DROP INDEX `user_games_user_id_game_id_room_id_uindex` ON `user_games`',
    );
    await queryRunner.query('DROP TABLE `user_games`');
  }
}
