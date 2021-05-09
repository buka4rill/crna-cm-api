import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Course {
  @PrimaryKey()
  id!: number;

  @Property({ type: "text" })
  title!: string;

  @Property({ type: "text" })
  shortDescription!: string;
  
  @Property({ type: "text" })
  fullDescription!: string;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}