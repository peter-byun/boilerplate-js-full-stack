import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Link {
  @PrimaryKey()
  id!: number;

  @Property()
  url!: string;

  @Property()
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
