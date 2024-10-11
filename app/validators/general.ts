import vine from '@vinejs/vine'

export const idValidator = vine.compile(vine.number().positive().min(1))
