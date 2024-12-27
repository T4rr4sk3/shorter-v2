import { DateTime } from 'luxon'
import env from '#start/env'

export default class ModelSerializer {
  public static serializeDate(date: DateTime | undefined | null) {
    if (env.get('DB_CONNECTION') !== 'mssql') return date
    return date?.toFormat('yyyy-MM-dd HH:mm:ss') || null
  }
}
