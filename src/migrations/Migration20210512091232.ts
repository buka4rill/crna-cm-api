import { Migration } from '@mikro-orm/migrations';

export class Migration20210512091232 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "app_user" drop constraint if exists "app_user_name_check";');
    this.addSql('alter table "app_user" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "app_user" alter column "name" drop not null;');
  }

}
