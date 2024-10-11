import type { HttpContext } from '@adonisjs/core/http'

import { createLinkValidator, updateLinkValidator } from '#validators/link'
import { ApplicationError } from '#exceptions/application_error'
import { idValidator } from '#validators/general'
import { DateTime } from 'luxon'
import Link from '#models/link'
import { CodeGenerator } from '../domain/code_generator.js'
import LinkGroup from '#models/link_group'

export default class LinksController {
  public async getAll() {
    return Link.query().preload('linkGroup' as any)
  }

  public async createLink({ request }: HttpContext) {
    const newLink = await createLinkValidator.validate(request.body())
    const expiresNormalized = newLink.expiresIn ? DateTime.fromISO(newLink.expiresIn) : null
    if (expiresNormalized && expiresNormalized.diffNow().milliseconds < 0)
      throw new ApplicationError('Expiration time is invalid')
    const groupExists = await this.groupExists(newLink.groupId)
    if (!groupExists) throw new ApplicationError('Group does not exist')
    const randomCode = new CodeGenerator().generate()
    return Link.create({
      ...newLink,
      code: randomCode,
      expiresAt: expiresNormalized,
    })
  }

  public async updateLink({ request }: HttpContext) {
    const linkId = await idValidator.validate(request.param('id'))
    const newLink = await updateLinkValidator.validate(request.body())
    const existingLink = await Link.find(linkId)
    if (!existingLink) throw new ApplicationError('Link not found')
    existingLink.name = newLink.name
    return existingLink.save()
  }

  public async deleteLink({ request }: HttpContext) {
    const linkId = await idValidator.validate(request.param('id'))
    const existingLink = await Link.find(linkId)
    await existingLink?.delete()
    return null
  }

  private async groupExists(groupId: number | undefined) {
    if (!groupId) return true
    const group = await LinkGroup.find(groupId)
    return Boolean(group)
  }
}
