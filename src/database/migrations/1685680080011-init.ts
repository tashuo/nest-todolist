import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1685680080011 implements MigrationInterface {
  name = 'Init1685680080011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(100) NOT NULL COMMENT 'password', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mission_users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL COMMENT '创建日期' DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` int NULL, \`missionId\` int NULL, INDEX \`idx_user_create\` (\`userId\`, \`created_at\`), INDEX \`idx_mission_create\` (\`missionId\`, \`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`missions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(1000) NOT NULL COMMENT '任务内容', \`created_at\` datetime(6) NOT NULL COMMENT '创建日期' DEFAULT CURRENT_TIMESTAMP(6), \`expired_at\` datetime NOT NULL COMMENT '截止日期', \`updated_at\` datetime(6) NOT NULL COMMENT '更新日期' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` int NULL, INDEX \`idx_created\` (\`created_at\`), INDEX \`idx_expired\` (\`expired_at\`), INDEX \`idx_user_created\` (\`userId\`, \`created_at\`), INDEX \`idx_user_expired\` (\`userId\`, \`expired_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`missionId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`idx_user\` (\`userId\`), INDEX \`idx_mission_created\` (\`missionId\`, \`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mission_users\` ADD CONSTRAINT \`FK_21ab30388c72b62ceaf8c3417cf\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mission_users\` ADD CONSTRAINT \`FK_06c247388e074570bb491699987\` FOREIGN KEY (\`missionId\`) REFERENCES \`missions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`missions\` ADD CONSTRAINT \`FK_d6aea52b4168ce8c4fb5a7ff0b5\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_f0788f2eaf50d8bdbd52b3f3167\` FOREIGN KEY (\`missionId\`) REFERENCES \`missions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_f0788f2eaf50d8bdbd52b3f3167\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`missions\` DROP FOREIGN KEY \`FK_d6aea52b4168ce8c4fb5a7ff0b5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mission_users\` DROP FOREIGN KEY \`FK_06c247388e074570bb491699987\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mission_users\` DROP FOREIGN KEY \`FK_21ab30388c72b62ceaf8c3417cf\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_mission_created\` ON \`comments\``,
    );
    await queryRunner.query(`DROP INDEX \`idx_user\` ON \`comments\``);
    await queryRunner.query(`DROP TABLE \`comments\``);
    await queryRunner.query(`DROP INDEX \`idx_user_expired\` ON \`missions\``);
    await queryRunner.query(`DROP INDEX \`idx_user_created\` ON \`missions\``);
    await queryRunner.query(`DROP INDEX \`idx_expired\` ON \`missions\``);
    await queryRunner.query(`DROP INDEX \`idx_created\` ON \`missions\``);
    await queryRunner.query(`DROP TABLE \`missions\``);
    await queryRunner.query(
      `DROP INDEX \`idx_mission_create\` ON \`mission_users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_user_create\` ON \`mission_users\``,
    );
    await queryRunner.query(`DROP TABLE \`mission_users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
