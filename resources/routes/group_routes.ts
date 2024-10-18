import router from '@adonisjs/core/services/router'

const LinkGroupsController = () => import('#controllers/link_groups_controller')

router.get('/groups', [LinkGroupsController, 'getAll'])
router.post('/group', [LinkGroupsController, 'createGroup'])
router.get('/group/:id', [LinkGroupsController, 'getById'])
router.patch('/group/:id', [LinkGroupsController, 'updateGroup'])
router.delete('/group/:id', [LinkGroupsController, 'deleteGroup'])