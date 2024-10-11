import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  DOMAIN: Env.schema.string({ format: 'url' }),
  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_CONNECTION: Env.schema.enum(['mssql', 'postgres']),
  // postgres
  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DATABASE: Env.schema.string(),
  // mssql
  MSSQL_HOST: Env.schema.string({ format: 'host' }),
  MSSQL_PORT: Env.schema.number(),
  MSSQL_USER: Env.schema.string(),
  MSSQL_PASSWORD: Env.schema.string.optional(),
  MSSQL_DATABASE: Env.schema.string(),
})
