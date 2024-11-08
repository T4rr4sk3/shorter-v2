import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const LinkGroupsController = () => import('#controllers/link_groups_controller')

router.get('/groups', [LinkGroupsController, 'getAll']).middleware(middleware.auth())
router.post('/group', [LinkGroupsController, 'createGroup']).middleware(middleware.auth())
router.get('/group/:id', [LinkGroupsController, 'getById']).middleware(middleware.auth())
router.patch('/group/:id', [LinkGroupsController, 'updateGroup']).middleware(middleware.auth())
router.delete('/group/:id', [LinkGroupsController, 'deleteGroup']).middleware(middleware.auth())
router.get('/groups/p', [LinkGroupsController, 'getAllPaginated']).middleware(middleware.auth())