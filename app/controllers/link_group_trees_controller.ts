import type { HttpContext } from '@adonisjs/core/http'
import { ApplicationError } from '#exceptions/application_error'
import { idValidator } from '#validators/general'
import LinkGroup from '#models/link_group'
import Link from '#models/link'

export default class LinkGroupTreesController {
  public async getLinkCompletePath({ request }: HttpContext) {
    const linkId = await idValidator.validate(request.param('linkId'))
    const existingLink = await Link.find(linkId)
    if (!existingLink) throw new ApplicationError('Link not found', 404)
    const { paths: linkPath, groups } = await this.getGroupPath(existingLink.groupId)
    linkPath.push(existingLink.name)
    return {
      link: existingLink,
      path: linkPath.join('/'),
      groupsOnPath: groups,
    }
  }

  public async getGroupCompletePath({ request }: HttpContext) {
    const groupId = await idValidator.validate(request.param('groupId'))
    const startingGroup = await LinkGroup.find(groupId)
    if (!startingGroup) throw new ApplicationError('Group not found', 404)
    const { paths, groups } = await this.getGroupPath(startingGroup.parentGroupId)
    paths.push(startingGroup.name)
    return {
      group: startingGroup,
      path: paths.join('/'),
      groupsOnPath: groups,
    }
  }

  private async getGroupPath(groupId: number | null) {
    const paths: string[] = []
    const groups: LinkGroup[] = []
    let parent = groupId
    while (parent !== null) {
      const parentGroup = await LinkGroup.find(parent)
      if (!parentGroup) break
      parent = parentGroup.parentGroupId
      groups.unshift(parentGroup)
      paths.unshift(parentGroup.name)
    }
    paths.unshift('/root')
    return {
      paths,
      groups,
    }
  }

  public async getLinksAndGroupsByParentGroupId({ request }: HttpContext) {
    const paramId = request.qs().groupId // || request.qs().parentGroupId
    if (!paramId) return this.getRootGroupAndChildrenWithLinks()
    const parentGroupId = await idValidator.validate(paramId)
    return this.getGroupAndChildrenWithLinksByGroupId(parentGroupId)
  }

  private async getGroupAndChildrenWithLinksByGroupId(
    groupId: number
  ): Promise<GroupAndChildrenWithLinks> {
    const getParentGroup = LinkGroup.find(groupId)
    const getLinks = Link.query().where('groupId', groupId)
    const getGroups = LinkGroup.query().where('parentGroupId', groupId)
    return Promise.all([getParentGroup, getGroups, getLinks]).then(
      ([parentGroup, childrenGroup, childrenLink]) => {
        return { parentGroup, childrenGroup, childrenLink }
      }
    )
  }

  private async getRootGroupAndChildrenWithLinks(): Promise<GroupAndChildrenWithLinks> {
    const getLinks = Link.query().whereNull('groupId')
    const getGroups = LinkGroup.query().whereNull('parentGroupId')
    const [childrenGroup, childrenLink] = await Promise.all([getGroups, getLinks])
    return { parentGroup: null, childrenGroup, childrenLink }
  }

  public async getGroupsByParentGroupId({ request }: HttpContext) {
    const paramId = request.qs().groupId // || request.qs().parentGroupId
    if (!paramId) return this.getRootGroupAndChildren()
    const parentGroupId = await idValidator.validate(paramId)
    return this.getGroupAndChildrenByGroupId(parentGroupId)
  }

  private async getRootGroupAndChildren(): Promise<GroupAndChildren> {
    const childrenGroup = await LinkGroup.query().whereNull('parentGroupId')
    return { parentGroup: null, childrenGroup }
  }

  private async getGroupAndChildrenByGroupId(groupId: number): Promise<GroupAndChildren> {
    const getParentGroup = LinkGroup.find(groupId)
    const getGroups = LinkGroup.query().where('parentGroupId', groupId)
    return Promise.all([getParentGroup, getGroups]).then(([parentGroup, childrenGroup]) => {
      return { parentGroup, childrenGroup }
    })
  }
}

type GroupAndChildrenWithLinks = {
  parentGroup: LinkGroup | null
  childrenGroup: LinkGroup[]
  childrenLink: Link[]
}

type GroupAndChildren = {
  parentGroup: LinkGroup | null
  childrenGroup: LinkGroup[]
}
