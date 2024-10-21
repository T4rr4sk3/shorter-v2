import { ApplicationError } from '#exceptions/application_error'
import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import TokenManager from '../domain/token_manager.js'

export default class AuthMiddleware {
  private readonly tokenManager = new TokenManager()

  async handle({ request }: HttpContext, next: NextFn) {
    const auth = request.header('authorization')
    if (!auth) throw new ApplicationError('Invalid authorization', 401)
    const token = this.removeBearer(auth)
    return this.tokenManager.verifyJWT(token).then((tokenInfo) => {
      const date = new Date()
      console.log(`Using token for ${tokenInfo.user} - ${date.toLocaleString()}`)
      return next()
    })
  }

  private removeBearer(header: string) {
    const bearerStr = 'Bearer'
    const withoutBearer = header.startsWith(bearerStr) ? header.substring(bearerStr.length) : header
    return withoutBearer.trim()
  }
}
