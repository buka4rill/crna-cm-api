import { Migration } from '@mikro-orm/migrations';

export class Migration20210510081149 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "app_user" add column "role" text[] not null default \'{user}\';');
  }

}
