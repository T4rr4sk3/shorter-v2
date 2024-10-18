import vine from '@vinejs/vine'
import { idSchema, nameSearchTransform } from './general.js'

const linkNameVine = vine.string().trim().maxLength(100)
const linkTagsVine = vine.array(idSchema).maxLength(5).optional()
const linkGroupVine = idSchema.optional().transform((value) => {
  return value || null
})

export const createLinkValidator = vine.compile(
  vine.object({
    name: linkNameVine,
    url: vine.string().trim().url().normalizeUrl().maxLength(2048),
    expiresIn: vine.string().trim().optional(),
    groupId: linkGroupVine,
    tags: linkTagsVine,
  })
)

export const updateLinkValidator = vine.compile(
  vine.object({
    name: linkNameVine,
    groupId: linkGroupVine,
    tags: linkTagsVine,
  })
)

export const getLinkValidator = vine.compile(
  vine.object({
    name: linkNameVine.transform(nameSearchTransform).optional(),
    groupId: idSchema.optional(),
    noGroup: vine.boolean().optional(),
    tag: idSchema.optional(),
    tags: vine.array(idSchema).optional(),
  })
)
