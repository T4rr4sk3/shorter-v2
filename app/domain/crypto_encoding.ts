import { BinaryToTextEncoding, createHash, Hash } from 'node:crypto'
import env from '#start/env'

export default class CryptoEncoding {
  private readonly hash: Hash
  private readonly defaultEncoding: BinaryToTextEncoding

  constructor() {
    this.hash = createHash(env.get('CRYPTO_ALG'))
    this.defaultEncoding = 'hex'
  }

  encode(data: string, encoding?: BinaryToTextEncoding) {
    const digestEncoding = encoding || this.defaultEncoding
    return this.hash.update(data).digest(digestEncoding)
  }
}
