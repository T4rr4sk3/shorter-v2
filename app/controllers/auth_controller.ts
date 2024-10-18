import type { HttpContext } from '@adonisjs/core/http'
import CryptoEncoding from '../domain/crypto_encoding.js'
import { getTokenValidator } from '#validators/auth'

export default class AuthController {
  private readonly cryptEncoding = new CryptoEncoding()

  public async getToken({ request }: HttpContext) {
    console.log(this.cryptEncoding.encode('teste'))
    return getTokenValidator.validate(request.body())
  }
}
