import vine from '@vinejs/vine'

export const getTokenValidator = vine.compile(
  vine.object({
    hash: vine.string(),
    user: vine.string().maxLength(30),
    createdAt: vine.string().maxLength(24),
  })
)
