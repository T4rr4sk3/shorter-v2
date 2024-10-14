import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import LinkGroup from './link_group.js'
import LinkTag from './link_tag.js'
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

  @column({ columnName: 'grupo_id' })
  declare groupId: number | null

  @manyToMany(() => LinkTag, {
    relatedKey: 'id',
    pivotForeignKey: 'shortlink_id',
    pivotRelatedForeignKey: 'shortlink_tag_id',
    pivotTable: 'coppetec.shortlinks_link_has_tags',
  })
  declare linkTags: ManyToMany<typeof LinkTag>

  @belongsTo(() => LinkGroup, { localKey: 'id', foreignKey: 'groupId' })
  declare linkGroup: BelongsTo<typeof LinkGroup>

  public isExpired() {
    if (!this.expiresAt) return false
    const difference = this.expiresAt.diffNow('days')
    return difference.get('days') < 0
  }
}
