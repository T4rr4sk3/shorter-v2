import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Link extends BaseModel {
  static table = 'coppetec.shortlinks'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string

  @column()
  declare url: string

  @column({ columnName: 'codigo' })
  declare code: string

  @column({ columnName: 'visitas' })
  declare visits: number

  @column.dateTime({ autoCreate: true, columnName: 'criado_em' })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'expira_em' })
  declare expiresAt: DateTime | null

  public isExpired() {
    if (!this.expiresAt) return false
    const difference = this.expiresAt.diffNow('days')
    return difference.get('days') < 0
  }
}
