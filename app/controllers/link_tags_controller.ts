import type { HttpContext } from '@adonisjs/core/http'
import type { PaginatedModel } from '../interfaces/pagination.js'

import {
  createTagValidator,
  getTagValidator,
  getTagValidatorWithPagination,
  updateTagValidator,
} from '#validators/tag'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { ApplicationError } from '#exceptions/application_error'
import { FIRST_PAGE, idValidator, MINIMUM_PER_PAGE } from '#validators/general'
import LinkTag from '#models/link_tag'

export default class LinkTagsController {
  public async getAll({ request }: HttpContext) {
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
    const tagNameInUse = await this.tagNameIsInUse(newTag.name)
    if (tagNameInUse) throw new ApplicationError('Tag name is in use')
    if (!newTag.color) newTag.color = '#42A5F5'
    return LinkTag.create(newTag)
  }

  public async updateTag({ request }: HttpContext) {
    const validId = idValidator.validate(request.param('id'))
    const validBody = updateTagValidator.validate(request.body())
    const [id, newTag] = await Promise.all([validId, validBody])
    const existingTag = await LinkTag.find(id)
    if (!existingTag) throw new ApplicationError('Tag not found')
    if (newTag.name !== existingTag.name) {
      const tagNameInUse = await this.tagNameIsInUse(newTag.name)
      if (tagNameInUse) throw new ApplicationError('Tag name is in use')
    }
    existingTag.name = newTag.name
    existingTag.color = newTag.color
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

  public async getAllPaginated({ request }: HttpContext) {
    const {
      name,
      page = FIRST_PAGE,
      perPage = MINIMUM_PER_PAGE,
    } = await getTagValidatorWithPagination.validate(request.qs())
    const tags = await LinkTag.query()
      .withCount('links')
      .if(name, (tagQ) => {
        tagQ.whereILike('name', name!)
      })
      .orderBy('id', 'desc')
      .paginate(page, perPage)
    return this.convertToPaginatedOutput(tags)
  }

  private convertToPaginatedOutput(model: ModelPaginatorContract<LinkTag>): PaginatedModel {
    const tags = model.all().map((tag) => ({ ...tag.toJSON(), links: tag.$extras.links_count }))
    return {
      hasNextPage: model.hasMorePages,
      currentPage: model.currentPage,
      firstPage: model.firstPage,
      lastPage: model.lastPage,
      length: model.length,
      total: model.total,
      data: tags,
    }
  }

  private async tagNameIsInUse(tagName: string) {
    const tag = await LinkTag.findBy('name', tagName)
    return Boolean(tag)
  }
}
