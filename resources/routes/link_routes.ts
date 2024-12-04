import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const LinksController = () => import('#controllers/links_controller')

router.get('/links', [LinksController, 'getAll']).middleware(middleware.auth())
router.post('/link', [LinksController, 'createLink']).middleware(middleware.auth())
router.get('/link/:id', [LinksController, 'getById']).middleware(middleware.auth())
router.patch('/link/:id', [LinksController, 'updateLink']).middleware(middleware.auth())
router.delete('/link/:id', [LinksController, 'deleteLink']).middleware(middleware.auth())
router.get('/links/p', [LinksController, 'getAllPaginated']).middleware(middleware.auth())