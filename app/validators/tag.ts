import { nameSearchTransform } from './general.js'
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

export const getTagValidator = vine.compile(
  vine.object({
    name: tagNameVine.transform(nameSearchTransform).optional(),
  })
)
