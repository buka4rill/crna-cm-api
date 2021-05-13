import dotenv from 'dotenv';
dotenv.config();

const server = {
  PORT: process.env.PORT,
  
}

const jwt = {
  SECRET_KEY: `${process.env.SECRET_KEY}`,
  EXPIRES_IN: process.env.EXPIRES_IN || '24h',
  
}

const bcrypt = {
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
  ADMIN_PSWD: `${process.env.ADMIN_PSWD}`,
}

const database = {
  DATABASE_URL: `${process.env.DATABASE_URL}`,
}

export { server, jwt, bcrypt, database };