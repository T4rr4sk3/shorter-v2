import vine from '@vinejs/vine'

export const idValidator = vine.compile(vine.number({ strict: true }).positive().min(1))
