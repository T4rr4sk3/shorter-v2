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
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  // security
  CRYPTO_ALG: Env.schema.enum(['SHA256', 'SHA384', 'SHA512']),
  AUTH_USER: Env.schema.string(),
  AUTH_SALT: Env.schema.string(),
  AUTH_PASS: Env.schema.string.optional(),
  AUTH_SECRET: Env.schema.string.optional(),
  AUTH_EXP: Env.schema.string.optional(),
})
