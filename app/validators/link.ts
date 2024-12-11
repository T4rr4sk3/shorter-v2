import vine from '@vinejs/vine'
import { idSchema, nameSearchTransform, paginationSchema } from './general.js'

const linkNameVine = vine.string().trim().maxLength(100)
const linkTagsVine = vine.array(idSchema).maxLength(5).optional()
const linkGroupVine = idSchema.optional().transform((value) => {
  return value || null
})
const linkExpiresVine = vine
  .string()
  .optional()
  .transform((value) => value || null)

export const createLinkValidator = vine.compile(
  vine.object({
    name: linkNameVine,
    url: vine.string().trim().url().normalizeUrl().maxLength(2048),
    expiresIn: linkExpiresVine,
    groupId: linkGroupVine,
    tags: linkTagsVine,
  })
)

export const updateLinkValidator = vine.compile(
  vine.object({
    name: linkNameVine,
    expiresIn: linkExpiresVine,
    groupId: linkGroupVine,
    tags: linkTagsVine,
  })
)

const linkSearch = vine.object({
  name: linkNameVine.transform(nameSearchTransform).optional(),
  groupId: idSchema.optional(),
  noGroup: vine.boolean().optional(),
  expired: vine.boolean().optional(),
  tag: idSchema.optional(),
  tags: vine.array(idSchema).optional(),
})

export const getLinkValidator = vine.compile(linkSearch)

export const getLinkValidatorWithPagination = vine.compile(
  vine.object({
    ...linkSearch.getProperties(),
    ...paginationSchema.getProperties(),
  })
)
