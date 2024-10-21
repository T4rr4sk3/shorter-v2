import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Link from './link.js'

export default class LinkTag extends BaseModel {
  static table = 'coppetec.shortlinks_tags'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string

  @column({ columnName: 'cor' })
  declare color: string

  @column.dateTime({ autoCreate: true, columnName: 'criado_em' })
  declare createdAt: DateTime

  @manyToMany(() => Link, {
    relatedKey: 'id',
    pivotForeignKey: 'shortlink_tag_id',
    pivotRelatedForeignKey: 'shortlink_id',
    pivotTable: 'coppetec.shortlinks_link_has_tags',
  })
  declare links: ManyToMany<typeof Link>
}
