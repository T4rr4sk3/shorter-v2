import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'
const LinksController = () => import('#controllers/links_controller')
const RedirectsController = () => import('#controllers/redirects_controller')
const QRsController = () => import('#controllers/qrs_controller')

router.get('/', async ({ request, response }) => {
  const host = request.hostname()
  const ip = request.ip()
  logger.info(`Index reached by host: ${host} (${ip})`)
  return response.status(418)
})

router.get('/links', [LinksController, 'getAll'])

router.post('/link', [LinksController, 'createLink'])

router.patch('/link/:id', [LinksController, 'updateLink'])

router.delete('/link/:id', [LinksController, 'deleteLink'])

router.get('/:code', [RedirectsController])

router.get('/:code/qrcode', [QRsController, 'getLinkQRcode'])
