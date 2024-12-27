import type { HttpContext } from '@adonisjs/core/http'

import {
  createLinkValidator,
  getLinkValidator,
  getLinkValidatorWithPagination,
  updateLinkValidator,
} from '#validators/link'
import { FIRST_PAGE, idValidator, MINIMUM_PER_PAGE } from '#validators/general'
import { ApplicationError } from '#exceptions/application_error'
import { PaginatedModel } from '../interfaces/pagination.js'
import { CodeGenerator } from '../domain/code_generator.js'
import db from '@adonisjs/lucid/services/db'
import LinkGroup from '#models/link_group'
import LinkTag from '#models/link_tag'
import { DateTime } from 'luxon'
import Link from '#models/link'

export default class LinksController {
  public async getAll({ request }: HttpContext) {
    const options = await getLinkValidator.validate(request.qs())
    return Link.query()
      .if(options.name, (linkQ) => {
        linkQ.whereILike('name', options.name!)
      })
      .if(
        options.groupId,
        (linkQ) => {
          linkQ.where('groupId', options.groupId!)
        },
        (linkQ) => {
          if (options.noGroup) linkQ.whereNull('groupId')
        }
      )
      .if(options.expired === false, (linkQ) =>
        linkQ.where('expiresAt', '>', DateTime.local().toSQLDate()).orWhereNull('expiresAt')
      )
      .if(options.expired === true, (linkQ) =>
        linkQ.where('expiresAt', '<=', DateTime.local().toSQLDate())
      )
      .if(options.tag, (linkQ) => {
        linkQ.whereRaw(
          `exists ( select * from ${LinkTag.table} as tag
            inner join ${LinkTag.pivotLinksHasTags} on tag.id = ${LinkTag.getPivotLinksHasTagsTagId()}
            where (tag.id = ?) and (${Link.table}.id = ${LinkTag.getPivotLinksHasTagsLinkId()}) )`,
          [options.tag!]
        )
        //linkQ.whereHas('linkTags', (tagQ) => tagQ.where('id', options.tag!))
      })
      .if(options.tags, (linkQ) => {
        const queryBindingsIn = options.tags?.map(() => '?').join() || ''
        linkQ.whereRaw(
          `exists ( select * from ${LinkTag.table} as tag
            inner join ${LinkTag.pivotLinksHasTags} on tag.id = ${LinkTag.getPivotLinksHasTagsTagId()}
            where (tag.id in (${queryBindingsIn})) and (${Link.table}.id = ${LinkTag.getPivotLinksHasTagsLinkId()}) )`,
          options.tags || []
        )
        //linkQ.whereHas('linkTags', (tagQ) => tagQ.whereIn('id', options.tags || []))
      })
      .preload('linkTags', (tagsQ) => tagsQ.orderBy('id', 'desc'))
      .preload('linkGroup')
      .orderBy('id', 'desc')
  }

  public async getById({ request }: HttpContext) {
    const linkId = await idValidator.validate(request.param('id'))
    const link = await Link.find(linkId)
    if (!link) throw new ApplicationError('Link not found')
    await link.load('linkGroup').then(() => link.load('linkTags'))
    return link
  }

  public async createLink({ request }: HttpContext) {
    const newLink = await createLinkValidator.validate(request.body())
    const linkCreated = new Link()
    linkCreated.expiresAt = newLink.expiresIn ? DateTime.fromISO(newLink.expiresIn) : null
    if (linkCreated.isExpired() || !linkCreated.isExpiresValid())
      throw new ApplicationError('Expiration time is invalid')
    const linkNameInUse = await this.linkNameIsInUse(newLink.name)
    if (linkNameInUse) throw new ApplicationError('Link name is in use')
    const groupExists = await this.groupExists(newLink.groupId)
    if (!groupExists) throw new ApplicationError('Group does not exist')
    const randomCode = new CodeGenerator().generate()
    const trx = await db.transaction()
    linkCreated.name = newLink.name
    linkCreated.url = newLink.url
    linkCreated.code = randomCode
    linkCreated.groupId = newLink.groupId
    linkCreated.useTransaction(trx)
    await linkCreated.save()
    if (newLink.groupId) await linkCreated.load('linkGroup')
    if (newLink.tags) {
      await linkCreated.related('linkTags').attach(newLink.tags, trx)
    }
    return trx.commit().then(() => linkCreated)
  }

  public async updateLink({ request }: HttpContext) {
    const linkId = await idValidator.validate(request.param('id'))
    const newLink = await updateLinkValidator.validate(request.body())
    const existingLink = await Link.find(linkId)
    if (!existingLink) throw new ApplicationError('Link not found')
    if (existingLink.name !== newLink.name) {
      const linkNameInUse = await this.linkNameIsInUse(newLink.name)
      if (linkNameInUse) throw new ApplicationError('Link name is in use')
    }
    const trx = await db.transaction()
    existingLink.useTransaction(trx)
    existingLink.name = newLink.name
    existingLink.expiresAt = newLink.expiresIn ? DateTime.fromISO(newLink.expiresIn) : null
    if (!existingLink.isExpiresValid()) throw new ApplicationError('Link expiration is invalid')
    if (newLink.groupId) {
      existingLink.groupId = newLink.groupId
    } else {
      existingLink.related('linkGroup').dissociate()
    }
    if (newLink.tags) {
      await existingLink.related('linkTags').sync(newLink.tags)
    }
    await existingLink.save().then(() => trx.commit())
    await Promise.all([existingLink.load('linkTags'), existingLink.load('linkGroup')])
    return existingLink
  }

  public async deleteLink({ request }: HttpContext) {
    const linkId = await idValidator.validate(request.param('id'))
    const existingLink = await Link.find(linkId)
    await existingLink?.delete()
    return null
  }

  public async getAllPaginated({ request }: HttpContext) {
    const {
      page = FIRST_PAGE,
      perPage = MINIMUM_PER_PAGE,
      ...options
    } = await getLinkValidatorWithPagination.validate(request.qs())
    const model = await Link.query()
      .if(options.name, (linkQ) => {
        linkQ.whereILike('name', options.name!)
      })
      .if(
        options.groupId,
        (linkQ) => {
          linkQ.where('groupId', options.groupId!)
        },
        (linkQ) => {
          if (options.noGroup) linkQ.whereNull('groupId')
        }
      )
      .if(options.tag, (linkQ) => {
        linkQ.whereHas('linkTags', (tagQ) => tagQ.where('id', options.tag!))
      })
      .if(options.tags, (linkQ) => {
        linkQ.whereHas('linkTags', (tagQ) => tagQ.whereIn('id', options.tags || []))
      })
      .preload('linkTags', (tagsQ) => tagsQ.orderBy('id', 'desc'))
      .preload('linkGroup')
      .orderBy('id', 'desc')
      .paginate(page, perPage)
    return {
      hasNextPage: model.hasMorePages,
      currentPage: model.currentPage,
      firstPage: model.firstPage,
      lastPage: model.lastPage,
      length: model.length,
      total: model.total,
      data: model.all(),
    } as PaginatedModel
  }

  private async groupExists(groupId: number | null) {
    if (!groupId) return true
    const group = await LinkGroup.find(groupId)
    return Boolean(group)
  }

  private async linkNameIsInUse(linkName: string) {
    const link = await Link.findBy('name', linkName)
    return Boolean(link)
  }
}
