import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Link from './link.js'
//import { DateTime } from 'luxon'

export default class LinkGroup extends BaseModel {
  static table = 'coppetec.shortlinks_grupos'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string

  @column({ columnName: 'grupo_id' })
  declare parentGroupId: number | null

  @hasMany(() => Link, { foreignKey: 'groupId' })
  declare links: HasMany<typeof Link>

  @hasMany(() => LinkGroup, { foreignKey: 'parentGroupId' })
  declare subGroups: HasMany<typeof LinkGroup>

  @belongsTo(() => LinkGroup, { foreignKey: 'parentGroupId' })
  declare parentGroup: BelongsTo<typeof LinkGroup>
}
