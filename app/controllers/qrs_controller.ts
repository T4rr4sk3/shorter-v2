import type { HttpContext } from '@adonisjs/core/http'
import { ApplicationError } from '#exceptions/application_error'
import { CodeGenerator } from '../domain/code_generator.js'
import { qrOptionsValidator } from '#validators/qrcode'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'
import { mkdirSync, rm } from 'node:fs'
import Link from '#models/link'
import env from '#start/env'
import QR from 'qrcode'

export default class QRsController {
  async getLinkQRcode({ request, response }: HttpContext) {
    const code = request.param('code')
    const generator = new CodeGenerator()
    if (!generator.verify(code)) {
      logger.info('Invalid code for: ' + code)
      return response.notFound()
    }
    const query = await qrOptionsValidator.validate(request.qs())
    const link = await Link.findBy('code', code)
    if (!link || link.isExpired()) return response.notFound()
    const fileType = this.getFileType(query.type)
    const fileName = `shortlink-${link.code}.${fileType}`
    response.header('content-disposition', `attachment; filename="${fileName}"`)
    const path = await this.generateFileToPath(query, link.code)
    response.download(path, false, (err) => {
      logger.error(err)
      const message = 'Unable to serve file, try again'
      return [message, 400]
    })
    this.deleteFile(path)
  }

  getFileType(query?: FileType): FileType {
    return query || 'png'
  }

  getTempPath(fileType: string) {
    const randomId = Math.random() * 10000
    mkdirSync(app.tmpPath(), { recursive: true })
    return app.tmpPath(randomId + '.' + fileType)
  }

  async generateFileToPath(query: QRCodeQuery, code: string) {
    const fileType = this.getFileType(query.type)
    const path = this.getTempPath(fileType)
    const domain = env.get('DOMAIN')
    if (!domain) {
      logger.info('App domain is not set')
      throw new ApplicationError('App domain is invalid')
    }
    await QR.toFile(path, `${domain}/${code}`, {
      errorCorrectionLevel: 'H',
      type: fileType,
      width: query.width,
      scale: query.scale,
    })

    return path
  }

  deleteFile(path: string) {
    setTimeout(
      (file: string) => {
        rm(file, { force: true, recursive: true, maxRetries: 5 }, (err) => {
          if (err) logger.error(err.message + '\nFailed to delete the file ' + file)
        })
      },
      500,
      path
    )
  }
}

type FileType = 'png' | 'svg'

type QRCodeQuery = {
  width?: number
  scale?: number
  type?: FileType
}
