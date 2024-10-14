import vine from '@vinejs/vine'

export const createTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
  })
)

export const updateTagValidator = createTagValidator
