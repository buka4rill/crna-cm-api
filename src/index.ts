import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { AppUser } from "./entities/AppUser";
// import { Course } from "./entities/Course";
import microConfig from './mikro-orm.config';
import express from 'express';
import { usersRouter }  from './routes/user';
import { authRouter }  from './routes/auth';
import bcrypt from "bcryptjs";
import { bcrypt as b } from './config';
import { courseRouter } from "./routes/course";


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

  // Inject routes
  app.use(usersRouter);
  app.use(authRouter);
  app.use(courseRouter);

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  })

  // Input some data in db
  let admin = await orm.em.findOne(AppUser, { email: "admin@admin.com" });

  // await orm.em.nativeDelete(AppUser, { id: 3 });

  if (admin) {
    return console.log("Admin user exists!");
  } else {
    console.log("creating admin user...");
    let admin = await orm.em.create(AppUser, {
      name: "Super Admin",
      email: "admin@admin.com",
      password: await bcrypt.hash(b.ADMIN_PSWD, 10),
      role: ["admin"],
      isAdmin: true,
    });
    console.log("Admin user created...");
    
    await orm.em.persistAndFlush(admin);
  }
};

main().catch(err => console.error(err));
