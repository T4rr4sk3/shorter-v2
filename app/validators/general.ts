import vine from '@vinejs/vine'

export const idSchema = vine.number().positive().min(1)

export const idValidator = vine.compile(idSchema)
