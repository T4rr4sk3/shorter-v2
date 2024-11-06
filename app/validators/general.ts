import vine from '@vinejs/vine'

export const idSchema = vine.number().positive().min(1)

export const idValidator = vine.compile(idSchema)

export const nameSearchTransform = (value: string) => {
  return '%' + value.replaceAll(/\s+/gi, '%') + '%'
}

export const paginationSchema = vine.object({
  page: vine.number().min(1).optional(),
  perPage: vine.number().min(5).optional(),
})
