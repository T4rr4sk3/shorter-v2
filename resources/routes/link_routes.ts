import router from '@adonisjs/core/services/router'

const LinksController = () => import('#controllers/links_controller')

router.get('/links', [LinksController, 'getAll'])
router.post('/link', [LinksController, 'createLink'])
router.get('/link/:id', [LinksController, 'getById'])
router.patch('/link/:id', [LinksController, 'updateLink'])
router.delete('/link/:id', [LinksController, 'deleteLink'])