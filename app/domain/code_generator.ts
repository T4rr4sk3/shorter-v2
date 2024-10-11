export class CodeGenerator {
  private codeRegex = RegExp(/^([a-zA-Z]|\d){5,10}$/)
  private possibleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  /** Generates a random code with digits and letters (uppercase and lowercase)
   * in the especified length
   * @param [length=5] The length of the code. Default is 5
   */
  generate(length = 5): string {
    let text = ''
    for (let i = 0; i < length; i++) {
      const randomPos = Math.floor(Math.random() * this.possibleChars.length)
      text += this.possibleChars.charAt(randomPos)
    }
    return text
  }

  /** Verifies if the code is created by this code generator. */
  verify(code: string | undefined): boolean {
    return code ? this.codeRegex.test(code) : false
  }
}
