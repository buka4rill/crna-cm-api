import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ type: "text" })
  name!: string;

  @Property({ type: "text", unique: true })
  email!: string;
  
  @Property({ type: "text" })
  password!: string;
  
  @Property({ type: "text", nullable: true })
  school?: string;
  
  @Property({ type: "text", nullable: true })
  city?: string;
  
  @Property({ type: "text", nullable: true })
  district?: string;
  
  @Property({ type: "text", nullable: true })
  country?: string;
  
  @Property()
  isAdmin?: boolean = false;
  
  @Enum({ items: () => UserRole, array: true, default: [UserRole.User]  })
  role?: UserRole[] = [UserRole.User];

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}


