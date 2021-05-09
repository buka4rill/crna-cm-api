import { Migration } from '@mikro-orm/migrations';

export class Migration20210509080925 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "course" ("id" serial primary key, "title" text not null, "short_description" text not null, "full_description" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

}
