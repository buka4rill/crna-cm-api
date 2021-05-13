// Setting up migrations for the postgres db
// using MikroORM
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Course } from "./entities/Course";
import { AppUser } from "./entities/AppUser";
import { database as db } from './config';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [AppUser, Course],
  dbName: 'carnadb',
  user: 'postgres',
  password: 'postgres',
  debug: !__prod__,
  type: 'postgresql',
  clientUrl: __prod__ ? db.DATABASE_URL : undefined,
} as Parameters<typeof MikroORM.init>[0];