import vine from '@vinejs/vine'
import { nameSearchTransform, paginationSchema } from './general.js'

const groupNameVine = vine.string().trim().maxLength(100)

export const createGroupValidator = vine.compile(
  vine.object({
    name: groupNameVine,
    parentGroupId: vine.number({ strict: true }).optional(),
  })
)

export const updateGroupValidator = createGroupValidator

const nameSearch = vine.object({
  name: groupNameVine.transform(nameSearchTransform).optional(),
})
export const getGroupValidator = vine.compile(nameSearch)

export const getGroupValidatorWithPagination = vine.compile(
  vine.object({
    ...nameSearch.getProperties(),
    ...paginationSchema.getProperties(),
  })
)
