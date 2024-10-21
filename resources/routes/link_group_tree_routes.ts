import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const LinkGroupTreesController = () => import('#controllers/link_group_trees_controller')

router.get('/link-group-tree/all', [LinkGroupTreesController, 'getLinksAndGroupsByParentGroupId']).middleware(middleware.auth())
router.get('/link-group-tree/groups', [LinkGroupTreesController, 'getGroupsByParentGroupId']).middleware(middleware.auth())
router.get('/link-group-tree/link-path/:linkId', [LinkGroupTreesController, 'getLinkCompletePath']).middleware(middleware.auth())
router.get('/link-group-tree/group-path/:groupId', [
  LinkGroupTreesController,
  'getGroupCompletePath',
]).middleware(middleware.auth())