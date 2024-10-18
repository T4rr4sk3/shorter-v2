import vine from '@vinejs/vine'
import { nameSearchTransform } from './general.js'

const groupNameVine = vine.string().trim().maxLength(100)

export const createGroupValidator = vine.compile(
  vine.object({
    name: groupNameVine,
    parentGroupId: vine.number({ strict: true }).optional(),
  })
)

export const updateGroupValidator = createGroupValidator

export const getGroupValidator = vine.compile(
  vine.object({
    name: groupNameVine.transform(nameSearchTransform).optional(),
  })
)
