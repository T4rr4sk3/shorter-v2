import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { ApplicationError } from './application_error.js'
import app from '@adonisjs/core/services/app'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof ApplicationError) {
      return ctx.response.status(error.code).send({
        message: error.message,
        name: error.name,
        status: error.code,
      })
    }

    if ((error as { code: string }).code === 'E_VALIDATION_ERROR') {
      return ctx.response.status(400).send({
        message: (error as any).message,
        messages: (error as any).messages,
        name: 'ValidationError',
        status: 400,
      })
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    if (error instanceof ApplicationError) return

    return super.report(error, ctx)
  }
}
