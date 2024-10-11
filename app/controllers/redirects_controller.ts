import type { HttpContext } from '@adonisjs/core/http'
import { CodeGenerator } from '../domain/code_generator.js'
import logger from '@adonisjs/core/services/logger'
import Link from '#models/link'

export default class RedirectsController {
  async handle({ request, response }: HttpContext) {
    const code = request.param('code')
    const generator = new CodeGenerator()
    if (!generator.verify(code)) {
      logger.info('Invalid code for: ' + code)
      return response.notFound()
    }
    const link = await Link.findBy('code', code)
    if (!link || link.isExpired()) return response.notFound(undefined, true)
    await Link.query().increment('visits').where('id', link.id)
    response.header('cache-control', 'no-cache, no-store, max-age=3600, must-revalidate')
    response.redirect(link.url)
    response.finish()
  }
}
