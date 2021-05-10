import { IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";
// import { NextFunction } from 'express'
export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  // next: NextFunction;
} 