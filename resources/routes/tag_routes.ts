import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const LinkTagsController = () => import('#controllers/link_tags_controller')

router.get('/tags', [LinkTagsController, 'getAll']).middleware(middleware.auth())
router.post('/tag', [LinkTagsController, 'createTag']).middleware(middleware.auth())
router.get('/tag/:id', [LinkTagsController, 'getById']).middleware(middleware.auth())
router.patch('/tag/:id', [LinkTagsController, 'updateTag']).middleware(middleware.auth())
router.delete('/tag/:id', [LinkTagsController, 'deleteTag']).middleware(middleware.auth())
router.get('/tags/p', [LinkTagsController, 'getAllPaginated']).middleware(middleware.auth())