import type { HttpContext } from '@adonisjs/core/http'
import LinkGroup from '#models/link_group'
import { createGroupValidator, updateGroupValidator } from '#validators/group'
import { idValidator } from '#validators/general'
import { ApplicationError } from '#exceptions/application_error'

export default class LinkGroupsController {
  public async getAll() {
    return LinkGroup.query().preload('parentGroup')
  }

  public async createGroup({ request }: HttpContext) {
    const newLinkGroup = await createGroupValidator.validate(request.body())
    const parentGroupExists = await this.existsGroup(newLinkGroup.parentGroupId)
    if (!parentGroupExists) throw new ApplicationError('Parent group not exists')
    return LinkGroup.create(newLinkGroup)
  }

  public async updateGroup({ request }: HttpContext) {
    const param = Number.parseInt(request.param('id'), 10)
    const validId = idValidator.validate(param)
    const validBody = updateGroupValidator.validate(request.body())
    const [id, newGroup] = await Promise.all([validId, validBody])
    const existingGroup = await LinkGroup.find(id)
    if (!existingGroup) throw new ApplicationError('Group not found')
    const parentGroupExists = await this.existsGroup(newGroup.parentGroupId)
    if (!parentGroupExists) throw new ApplicationError('Parent group not exists')
    existingGroup.parentGroupId = newGroup.parentGroupId || null
    existingGroup.name = newGroup.name
    return existingGroup.save()
  }

  public async deleteGroup({ request }: HttpContext) {
    const param = Number.parseInt(request.param('id'), 10)
    const id = await idValidator.validate(param)
    const existingGroup = await LinkGroup.find(id)
    await existingGroup?.delete()
    return null
  }

  async existsGroup(groupId: number | undefined): Promise<boolean> {
    if (!groupId) return true
    const group = await LinkGroup.find(groupId)
    return !!group
  }
}
