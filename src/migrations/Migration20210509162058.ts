import { Migration } from '@mikro-orm/migrations';

export class Migration20210509162058 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_school_check";');
    this.addSql('alter table "user" alter column "school" type text using ("school"::text);');
    this.addSql('alter table "user" alter column "school" drop not null;');
    this.addSql('alter table "user" drop constraint if exists "user_city_check";');
    this.addSql('alter table "user" alter column "city" type text using ("city"::text);');
    this.addSql('alter table "user" alter column "city" drop not null;');
    this.addSql('alter table "user" drop constraint if exists "user_district_check";');
    this.addSql('alter table "user" alter column "district" type text using ("district"::text);');
    this.addSql('alter table "user" alter column "district" drop not null;');
    this.addSql('alter table "user" drop constraint if exists "user_country_check";');
    this.addSql('alter table "user" alter column "country" type text using ("country"::text);');
    this.addSql('alter table "user" alter column "country" drop not null;');
  }

}
