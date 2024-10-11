import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class IndicesController {
  async handle({ request, response }: HttpContext) {
    const host = request.hostname()
    const ip = request.ip()
    logger.info(`Index reached by host: ${host} (${ip})`)
    return response.status(418)
  }
}
