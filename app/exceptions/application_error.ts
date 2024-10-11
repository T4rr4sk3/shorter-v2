/** Represents a request error with message, status code and name of the error */
export class ApplicationError extends Error {
  public readonly code: number
  constructor(message: string, code = 400, name?: string) {
    super(message)
    this.code = code
    this.name = name || (code === 400 ? 'BadRequestError' : 'RequestError')
  }
}
