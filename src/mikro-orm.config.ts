// Setting up migrations for the postgres db
// using MikroORM
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Course } from "./entities/Course";
import { AppUser } from "./entities/AppUser";
// import { database as db } from './config';
import dotenv from 'dotenv';
dotenv.config();

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    disableForeignKeys: false,
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  driverOptions: {
    connection: __prod__ ? {
      ssl: { rejectUnauthorized: false }
    } : { }
  },
  entities: [AppUser, Course],
  dbName: __prod__ ? process.env.DATABASE : 'carnadb',
  user: __prod__ ? process.env.USER : 'postgres',
  password: __prod__ ? process.env.PASSWORD : 'postgres',
  debug: !__prod__,
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
} as Parameters<typeof MikroORM.init>[0];