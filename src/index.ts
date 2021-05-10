import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { User } from "./entities/User";
// import { Course } from "./entities/Course";
import microConfig from './mikro-orm.config';
import express from 'express';
import { usersRouter }  from './routes/user';
import bcrypt from "bcryptjs";
import { bcrypt as b } from './config';


const main = async () => {
  // connect to PG database
  const orm = await MikroORM.init(microConfig);

  // run migrations
  await orm.getMigrator().up();

  // Initialize Express
  const app = express();

  // Initialize express middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (_, res) => {
    res.send("Hello from express!");
  })


  app.use(usersRouter);

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  })

  // Input some data in db
  let admin = await orm.em.findOne(User, { email: "admin@admin.com" });

  if (admin) {
    return console.log("Admin user exists!");
  } else {
    console.log("creating admin user...");
    let admin = await orm.em.create(User, {
      id: 1,
      name: "Super Admin",
      email: "admin@admin.com",
      password: await bcrypt.hash(b.ADMIN_PSWD, 10),
      role: ["admin"],
      isAdmin: true,
    });
    console.log("Admin user created...");
    
    await orm.em.persistAndFlush(admin);

  }
  // await orm.em.persistAndFlush(course);
  
  // const course = await orm.em.find(Course, {});
  // console.log(course);
  // const admin = await orm.em.find(User, {});
  console.log(admin);
};

main().catch(err => console.error(err));
