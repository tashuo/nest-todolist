import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notice1685692581875 implements MigrationInterface {
  name = 'Notice1685692581875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` int NOT NULL COMMENT '类型', \`target_id\` int NOT NULL COMMENT '目标ID,如任务ID、评论ID等', \`content\` varchar(1000) NOT NULL COMMENT '内容', \`is_read\` tinyint NOT NULL COMMENT '是否已读', \`created_at\` datetime(6) NOT NULL COMMENT '创建日期' DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` int NULL, INDEX \`idx_user_created_read\` (\`userId\`, \`created_at\`, \`is_read\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notices\` ADD CONSTRAINT \`FK_79364067097eea7912bb08855b6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notices\` DROP FOREIGN KEY \`FK_79364067097eea7912bb08855b6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_user_created_read\` ON \`notices\``,
    );
    await queryRunner.query(`DROP TABLE \`notices\``);
  }
}
