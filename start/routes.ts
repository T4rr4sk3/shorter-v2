import router from '@adonisjs/core/services/router'

const QRsController = () => import('#controllers/qrs_controller')
const IndicesController = () => import('#controllers/indices_controller')
const RedirectsController = () => import('#controllers/redirects_controller')
const LinksController = () => import('#controllers/links_controller')
const LinkGroupsController = () => import('#controllers/link_groups_controller')
const LinkGroupTreesController = () => import('#controllers/link_group_trees_controller')

// links
router.get('/links', [LinksController, 'getAll'])
router.post('/link', [LinksController, 'createLink'])
router.patch('/link/:id', [LinksController, 'updateLink'])
router.delete('/link/:id', [LinksController, 'deleteLink'])

// groups
router.get('/groups', [LinkGroupsController, 'getAll'])
router.post('/group', [LinkGroupsController, 'createGroup'])
router.patch('/group/:id', [LinkGroupsController, 'updateGroup'])
router.delete('/group/:id', [LinkGroupsController, 'deleteGroup'])

// link-group-tree
router.get('/link-group-tree/all', [LinkGroupTreesController, 'getLinksAndGroupsByParentGroupId'])
router.get('/link-group-tree/groups', [LinkGroupTreesController, 'getGroupsByParentGroupId'])
router.get('/link-group-tree/link-path/:linkId', [LinkGroupTreesController, 'getLinkCompletePath'])
router.get('/link-group-tree/group-path/:groupId', [
  LinkGroupTreesController,
  'getGroupCompletePath',
])

// tags
// to be made

// index
router.get('/', [IndicesController])
router.get('/:code', [RedirectsController])
router.get('/:code/qrcode', [QRsController, 'getLinkQRcode'])
