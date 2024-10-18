import { ApplicationError } from '#exceptions/application_error'
import LinkTag from '#models/link_tag'
import { idValidator } from '#validators/general'
import { createTagValidator, getTagValidator, updateTagValidator } from '#validators/tag'
import type { HttpContext } from '@adonisjs/core/http'

export default class LinkTagsController {
  async getAll({ request }: HttpContext) {
    const { name } = await getTagValidator.validate(request.qs())
    const tags = await LinkTag.query()
      .withCount('links')
      .if(name, (tagQ) => {
        tagQ.whereILike('name', name!)
      })
      .orderBy('id', 'desc')
    return tags.map((tag) => ({
      ...tag.toJSON(),
      links: tag.$extras.links_count,
    }))
  }

  public async createTag({ request }: HttpContext) {
    const newTag = await createTagValidator.validate(request.body())
    return LinkTag.create(newTag)
  }

  public async updateTag({ request }: HttpContext) {
    const validId = idValidator.validate(request.param('id'))
    const validBody = updateTagValidator.validate(request.body())
    const [id, newTag] = await Promise.all([validId, validBody])
    const existingTag = await LinkTag.find(id)
    if (!existingTag) throw new ApplicationError('Tag not found')
    existingTag.name = newTag.name
    return existingTag.save()
  }

  public async deleteTag({ request }: HttpContext) {
    const id = await idValidator.validate(request.param('id'))
    const existingTag = await LinkTag.find(id)
    await existingTag?.delete()
    return null
  }

  public async getById({ request }: HttpContext) {
    const tagId = await idValidator.validate(request.param('id'))
    const existingTag = await LinkTag.find(tagId)
    if (!existingTag) throw new ApplicationError('Tag not found')
    await existingTag.load('links', (linkQ) => linkQ.preload('linkGroup').orderBy('id'))
    return existingTag
  }
}
