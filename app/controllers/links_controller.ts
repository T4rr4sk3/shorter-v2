import type { HttpContext } from '@adonisjs/core/http'

import { createLinkValidator, getLinkValidator, updateLinkValidator } from '#validators/link'
import { ApplicationError } from '#exceptions/application_error'
import { CodeGenerator } from '../domain/code_generator.js'
import { idValidator } from '#validators/general'
import db from '@adonisjs/lucid/services/db'
import LinkGroup from '#models/link_group'
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
      .if(options.tag, (linkQ) => {
        linkQ.whereHas('linkTags', (tagQ) => tagQ.where('id', options.tag!))
      })
      .if(options.tags, (linkQ) => {
        linkQ.whereHas('linkTags', (tagQ) => tagQ.whereIn('id', options.tags || []))
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
    const expiresNormalized = newLink.expiresIn ? DateTime.fromISO(newLink.expiresIn) : null
    if (expiresNormalized && expiresNormalized.diffNow().milliseconds < 0)
      throw new ApplicationError('Expiration time is invalid')
    const groupExists = await this.groupExists(newLink.groupId)
    if (!groupExists) throw new ApplicationError('Group does not exist')
    const randomCode = new CodeGenerator().generate()
    const trx = await db.transaction()
    const linkCreated = new Link()
    linkCreated.name = newLink.name
    linkCreated.url = newLink.url
    linkCreated.code = randomCode
    linkCreated.groupId = newLink.groupId
    linkCreated.expiresAt = expiresNormalized
    linkCreated.useTransaction(trx)
    await linkCreated.save()
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
    const trx = await db.transaction()
    existingLink.useTransaction(trx)
    existingLink.name = newLink.name
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

  private async groupExists(groupId: number | null) {
    if (!groupId) return true
    const group = await LinkGroup.find(groupId)
    return Boolean(group)
  }
}
