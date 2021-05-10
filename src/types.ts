import { IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";
import { Request, Response } from "express";
import session, { SessionData } from "express-session";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: session.Session & Partial<SessionData> };
  res: Response;
} 