import { BinaryToTextEncoding, createHash } from 'node:crypto'
import env from '#start/env'

export default interface CryptoEncoder {
  encode: (data: string, encoding?: BinaryToTextEncoding) => string
}

export class CryptoDefaultEncoder {
  private readonly algorithm: string
  private readonly defaultEncoding: BinaryToTextEncoding

  constructor() {
    this.algorithm = env.get('CRYPTO_ALG')
    this.defaultEncoding = 'hex'
  }

  encode(data: string, encoding?: BinaryToTextEncoding) {
    const digestEncoding = encoding || this.defaultEncoding
    return createHash(this.algorithm).update(data).digest(digestEncoding)
  }
}
