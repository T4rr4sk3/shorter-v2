import vine from '@vinejs/vine'

export const idSchema = vine.number().positive().min(1)

export const idValidator = vine.compile(idSchema)

export const nameSearchTransform = (value: string) => {
  return '%' + value.replaceAll(/\s+/gi, '%') + '%'
}

export const FIRST_PAGE = 1
export const MINIMUM_PER_PAGE = 5
export const paginationSchema = vine.object({
  page: vine.number().min(FIRST_PAGE).optional(),
  perPage: vine.number().min(MINIMUM_PER_PAGE).optional(),
})
