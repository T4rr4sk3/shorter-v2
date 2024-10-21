import type { HttpContext } from '@adonisjs/core/http'
import { getTokenValidator } from '#validators/auth'
import LoginHashVerifier from '../domain/login_hash_verifier.js'
import TokenManager from '../domain/token_manager.js'

export default class AuthController {
  private readonly loginVerifier = new LoginHashVerifier()
  private readonly tokenManager = new TokenManager()

  public async getToken({ request }: HttpContext) {
    const { user, hash, timestamp } = await getTokenValidator.validate(request.body())
    this.loginVerifier.verify(user, hash, timestamp)
    const token = await this.tokenManager.generateJWT(user)
    return { token }
  }
}
