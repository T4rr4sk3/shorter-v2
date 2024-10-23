import { ApplicationError } from '#exceptions/application_error'
import env from '#start/env'
import { DateTime } from 'luxon'
import CryptoEncoder, { CryptoDefaultEncoder } from './crypto_encoding.js'

export default class LoginHashVerifier {
  private readonly encoder: CryptoEncoder
  private readonly user: string
  private readonly salt: string
  private readonly pass: string | undefined

  constructor(cryptoEncoder: CryptoEncoder = new CryptoDefaultEncoder()) {
    this.encoder = cryptoEncoder
    this.user = env.get('AUTH_USER')
    this.salt = env.get('AUTH_SALT')
    this.pass = env.get('AUTH_PASS')
  }

  verify(user: string, hash: string, timestamp?: string | number) {
    //if (env.get('NODE_ENV') === 'development') return
    const hashToVerify = this.createHash(user, timestamp)
    if (hashToVerify !== hash) throw new ApplicationError('Invalid login (11)', 401)
    const correctHash = this.createHash(this.user, timestamp)
    if (hash !== correctHash) throw new ApplicationError('Invalid login (10)', 401)
  }

  private createHash(user: string, timestamp?: string | number): string {
    const keys = [this.salt]
    if (timestamp) {
      const datetime = new Date(timestamp).getTime()
      if (Number.isNaN(datetime)) throw new ApplicationError('Invalid timestamp')
      const date = DateTime.fromMillis(datetime)
      const now = DateTime.now()
      const differenceInMinutes = 30
      const passedFromNow = now.diff(date, 'minutes').get('minutes')
      if (passedFromNow > differenceInMinutes || passedFromNow < differenceInMinutes * -1)
        throw new ApplicationError('Difference between timestamp and now passed the limit')
      keys.unshift(datetime.toString())
      keys.push(datetime.toString())
    }
    keys.unshift(user)
    if (this.pass) keys.push(this.pass)
    return this.encoder.encode(keys.join('-'))
  }
}
