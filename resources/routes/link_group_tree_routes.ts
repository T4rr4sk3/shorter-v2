import router from '@adonisjs/core/services/router'

const LinkGroupTreesController = () => import('#controllers/link_group_trees_controller')

router.get('/link-group-tree/all', [LinkGroupTreesController, 'getLinksAndGroupsByParentGroupId'])
router.get('/link-group-tree/groups', [LinkGroupTreesController, 'getGroupsByParentGroupId'])
router.get('/link-group-tree/link-path/:linkId', [LinkGroupTreesController, 'getLinkCompletePath'])
router.get('/link-group-tree/group-path/:groupId', [
  LinkGroupTreesController,
  'getGroupCompletePath',
])