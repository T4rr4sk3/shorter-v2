import type { HttpContext } from '@adonisjs/core/http'
import LinkGroup from '#models/link_group'
import { createGroupValidator, getGroupValidator, updateGroupValidator } from '#validators/group'
import { idValidator } from '#validators/general'
import { ApplicationError } from '#exceptions/application_error'

export default class LinkGroupsController {
  public async getAll({ request }: HttpContext) {
    const { name } = await getGroupValidator.validate(request.qs())
    const groups = await LinkGroup.query()
      .if(name, (groupQ) => groupQ.whereILike('name', name!))
      .withCount('links')
      .preload('parentGroup')
      .orderBy('id', 'desc')
    return groups.map((group) => ({
      ...group.toJSON(),
      links: group.$extras.links_count,
    }))
  }

  public async createGroup({ request }: HttpContext) {
    const newLinkGroup = await createGroupValidator.validate(request.body())
    const parentGroupExists = await this.existsGroup(newLinkGroup.parentGroupId)
    if (!parentGroupExists) throw new ApplicationError('Parent group not exists')
    const groupCreated = await LinkGroup.create(newLinkGroup)
    if (groupCreated.parentGroupId) await groupCreated.load('parentGroup')
    return groupCreated
  }

  public async updateGroup({ request }: HttpContext) {
    const validId = idValidator.validate(request.param('id'))
    const validBody = updateGroupValidator.validate(request.body())
    const [id, newGroup] = await Promise.all([validId, validBody])
    if (id === newGroup.parentGroupId) throw new ApplicationError('Circular reference not allowed')
    const existingGroup = await LinkGroup.find(id)
    if (!existingGroup) throw new ApplicationError('Group not found')
    const newParentGroup = newGroup.parentGroupId
      ? await LinkGroup.find(newGroup.parentGroupId)
      : null
    if (!newParentGroup && newGroup.parentGroupId)
      throw new ApplicationError('Parent group not exists')
    if (newParentGroup?.parentGroupId === id)
      throw new ApplicationError('New parent is child of current group')
    existingGroup.parentGroupId = newGroup.parentGroupId || null
    existingGroup.name = newGroup.name
    return existingGroup
      .save()
      .then((group) => group.load('parentGroup'))
      .then(() => existingGroup)
  }

  public async deleteGroup({ request }: HttpContext) {
    const id = await idValidator.validate(request.param('id'))
    const existingGroup = await LinkGroup.find(id)
    await existingGroup?.delete()
    return null
  }

  public async getById({ request }: HttpContext) {
    const groupId = await idValidator.validate(request.param('id'))
    const existingGroup = await LinkGroup.find(groupId)
    if (!existingGroup) throw new ApplicationError('Group not found')
    const loadLinks = existingGroup.load('links')
    const loadParentGroup = existingGroup.load('parentGroup')
    await Promise.all([loadLinks, loadParentGroup])
    return existingGroup
  }

  async existsGroup(groupId: number | undefined): Promise<boolean> {
    if (!groupId) return true
    const group = await LinkGroup.find(groupId)
    return !!group
  }
}
