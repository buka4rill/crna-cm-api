import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Course } from "./entities/course";
import microConfig from './mikro-orm.config';

const main = async () => {
  // connect to PG database
  const orm = await MikroORM.init(microConfig);

  // run migrations
  await orm.getMigrator().up();

  // Input some data in db
  // const course = orm.em.create(Course, { 
  //   title: 'test course', 
  //   shortDescription: "lorem ipsum", 
  //   fullDescription: "more lorem ipsum" 
  // });
  // await orm.em.persistAndFlush(course);
  
  const course = await orm.em.find(Course, {});
  console.log(course);
};

main().catch(err => console.error(err));
