import type { HttpContext } from '@adonisjs/core/http'

import { createLinkValidator, updateLinkValidator } from '#validators/link'
import { ApplicationError } from '#exceptions/application_error'
import { idValidator } from '#validators/general'
import { DateTime } from 'luxon'
import Link from '#models/link'
import { CodeGenerator } from '../domain/code_generator.js'

export default class LinksController {
  public async getAll() {
    return Link.all()
  }

  public async createLink({ request }: HttpContext) {
    const link = await createLinkValidator.validate(request.body())
    const expiresNormalized = link.expiresIn ? DateTime.fromISO(link.expiresIn) : null
    if (expiresNormalized && expiresNormalized.diffNow().milliseconds < 0)
      throw new ApplicationError('Expiration time is invalid')

    const randomCode = new CodeGenerator().generate()
    return Link.create({
      name: link.name,
      code: randomCode,
      url: link.url,
      expiresAt: expiresNormalized,
    })
  }

  public async updateLink({ request }: HttpContext) {
    const param = Number.parseInt(request.param('id'), 10)
    const linkId = await idValidator.validate(param)
    const newLink = await updateLinkValidator.validate(request.body())
    const existingLink = await Link.find(linkId)
    if (!existingLink) throw new ApplicationError('Link not found')
    existingLink.name = newLink.name
    return existingLink.save()
  }

  public async deleteLink({ request }: HttpContext) {
    const param = Number.parseInt(request.param('id'), 10)
    const linkId = await idValidator.validate(param)
    const existingLink = await Link.find(linkId)
    await existingLink?.delete()
    return null
  }
}
