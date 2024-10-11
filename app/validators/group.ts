import vine from '@vinejs/vine'

export const createGroupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
    parentGroupId: vine.number({ strict: true }).optional(),
  })
)

export const updateGroupValidator = createGroupValidator
