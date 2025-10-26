import { Migration } from '@mikro-orm/migrations';

export class Migration20251025083703 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "link" ("id" serial primary key, "url" varchar(255) not null, "title" varchar(255) not null, "description" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "link" cascade;`);
  }

}
