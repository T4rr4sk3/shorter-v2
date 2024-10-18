import router from '@adonisjs/core/services/router'

const LinkTagsController = () => import('#controllers/link_tags_controller')

router.get('/tags', [LinkTagsController, 'getAll'])
router.post('/tag', [LinkTagsController, 'createTag'])
router.get('/tag/:id', [LinkTagsController, 'getById'])
router.patch('/tag/:id', [LinkTagsController, 'updateTag'])
router.delete('/tag/:id', [LinkTagsController, 'deleteTag'])