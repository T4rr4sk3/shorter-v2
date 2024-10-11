import vine from '@vinejs/vine'

const linkNameVine = vine.string().trim().maxLength(100)

export const createLinkValidator = vine.compile(
  vine.object({
    name: linkNameVine,
    url: vine.string().trim().url().normalizeUrl().maxLength(2048),
    expiresIn: vine.string().trim().optional(),
  })
)

export const updateLinkValidator = vine.compile(
  vine.object({
    name: linkNameVine,
  })
)
