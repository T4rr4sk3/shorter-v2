import { nameSearchTransform, paginationSchema } from './general.js'
import vine from '@vinejs/vine'

const tagNameVine = vine.string().trim().maxLength(100)
const tagColorVine = vine.string().trim().maxLength(15)

export const createTagValidator = vine.compile(
  vine.object({
    name: tagNameVine,
    color: tagColorVine.optional(),
  })
)

export const updateTagValidator = vine.compile(
  vine.object({
    name: tagNameVine,
    color: tagColorVine,
  })
)

const nameSearch = vine.object({
  name: tagNameVine.transform(nameSearchTransform).optional(),
})
export const getTagValidator = vine.compile(nameSearch)

export const getTagValidatorWithPagination = vine.compile(
  vine.object({
    ...nameSearch.getProperties(),
    ...paginationSchema.getProperties(),
  })
)
