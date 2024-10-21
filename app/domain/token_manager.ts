import { ApplicationError } from '#exceptions/application_error'
import env from '#start/env'
import { SignJWT, jwtVerify, errors } from 'jose'

export default class TokenManager {
  private readonly secret = env.get(
    'AUTH_SECRET',
    '631f9e02999b732d274c0db3d3a101893b17766b294571fe4b9a50fdc8aff64e'
  )
  private readonly issuer = 'u:shorter:issuer'
  private readonly audience = 'u:auth:audience'
  private readonly expires = env.get('AUTH_EXP', '5s')
  public async generateJWT(user: string): Promise<string> {
    const tokenInfo: TokenInfo = { user }
    return new SignJWT(tokenInfo)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(this.expires)
      .sign(this.getSecret())
  }

  private getSecret() {
    return Buffer.from(this.secret)
  }

  public async verifyJWT(token: string): Promise<TokenInfo> {
    try {
      const decodedToken = await jwtVerify(token, this.getSecret(), {
        issuer: this.issuer,
        audience: this.audience,
      })
      return decodedToken.payload as TokenInfo
    } catch (e) {
      if (e instanceof errors.JWTExpired) this.throwError('Token expired')
      if (e instanceof errors.JWTInvalid) this.throwError('Token invalid')
      this.throwError(e.message || e)
    }
  }

  private throwError(message: string): never {
    throw new ApplicationError(message, 401, 'JWTError')
  }
}

type TokenInfo = { user: string }
