import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION'),
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('PG_HOST'),
        port: env.get('PG_PORT'),
        user: env.get('PG_USER'),
        password: env.get('PG_PASSWORD'),
        database: env.get('PG_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        //paths: ['database/migrations'],
      },
    },
    mssql: {
      client: 'mssql',
      connection: {
        server: env.get('MSSQL_HOST'),
        port: env.get('MSSQL_PORT'),
        user: env.get('MSSQL_USER'),
        password: env.get('MSSQL_PASSWORD'),
        database: env.get('MSSQL_DATABASE'),
      },
      migrations: {
        naturalSort: true,
      },
      pool: {
        min: 1,
        max: 5,
      },
    },
  },
})

export default dbConfig
