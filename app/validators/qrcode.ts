import vine from '@vinejs/vine'

export const qrOptionsValidator = vine.compile(
  vine.object({
    scale: vine.number().optional(),
    width: vine.number().optional(),
    type: vine
      .enum(['png', 'svg', '.png', '.svg'])
      .optional()
      .transform((value) => {
        return (value.endsWith('svg') ? 'svg' : 'png') as 'svg' | 'png' | undefined
      }),
  })
)
