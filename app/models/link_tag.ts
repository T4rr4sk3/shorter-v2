import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import ModelSerializer from '../domain/model_serializer.js'
import { DateTime } from 'luxon'
import Link from './link.js'

export default class LinkTag extends BaseModel {
  static table = 'coppetec.shortlinks_tags'
  static pivotLinksHasTags = 'coppetec.shortlinks_link_has_tags'
  static pivotLinksHasTagsTagId = 'shortlink_tag_id'
  static pivotLinksHasTagsLinkId = 'shortlink_id'

  static getPivotLinksHasTagsTagId() {
    return this.pivotLinksHasTags + '.' + this.pivotLinksHasTagsTagId
  }

  static getPivotLinksHasTagsLinkId() {
    return this.pivotLinksHasTags + '.' + this.pivotLinksHasTagsLinkId
  }

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string

  @column({ columnName: 'cor' })
  declare color: string

  @column.dateTime({
    columnName: 'criado_em',
    serialize: ModelSerializer.serializeDate,
  })
  declare createdAt: DateTime

  @manyToMany(() => Link, {
    relatedKey: 'id',
    pivotForeignKey: LinkTag.pivotLinksHasTagsTagId,
    pivotRelatedForeignKey: LinkTag.pivotLinksHasTagsLinkId,
    pivotTable: LinkTag.pivotLinksHasTags,
  })
  declare links: ManyToMany<typeof Link>
}
