import { nameSearchTransform } from './general.js'
import vine from '@vinejs/vine'

const tagNameVine = vine.string().trim().maxLength(100)

export const createTagValidator = vine.compile(
  vine.object({
    name: tagNameVine,
  })
)

export const updateTagValidator = createTagValidator

export const getTagValidator = vine.compile(
  vine.object({
    name: tagNameVine.transform(nameSearchTransform).optional(),
  })
)
