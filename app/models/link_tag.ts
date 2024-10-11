import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Link from './link.js'
//import { DateTime } from 'luxon'

export default class LinkTag extends BaseModel {
  static table = 'coppetec.shortlinks_tags'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string

  @manyToMany(() => Link, {
    relatedKey: 'id',
    pivotForeignKey: 'shortlink_tag_id',
    pivotRelatedForeignKey: 'shortlink_id',
    pivotTable: 'coppetec.shortlinks_link_has_tags',
  })
  declare links: ManyToMany<typeof Link>
}
