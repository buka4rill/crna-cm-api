// Setting up migrations for the postgres db
// using MikroORM
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Course } from "./entities/course";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Course, User],
  dbName: 'carnadb',
  user: 'postgres',
  password: 'postgres',
  debug: !__prod__,
  type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0];