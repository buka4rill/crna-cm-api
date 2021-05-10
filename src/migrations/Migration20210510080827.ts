import { Migration } from '@mikro-orm/migrations';

export class Migration20210510080827 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "course" ("id" serial primary key, "title" text not null, "short_description" text not null, "full_description" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "app_user" ("id" serial primary key, "name" text not null, "email" text not null, "password" text not null, "school" text null, "city" text null, "district" text null, "country" text null, "is_admin" bool not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "app_user" add constraint "app_user_email_unique" unique ("email");');
  }

}
