import router from '@adonisjs/core/services/router'

import '../resources/routes/auth_routes.js'
import '../resources/routes/link_group_tree_routes.js'
import '../resources/routes/group_routes.js'
import '../resources/routes/link_routes.js'
import '../resources/routes/tag_routes.js'

const QRsController = () => import('#controllers/qrs_controller')
const IndicesController = () => import('#controllers/indices_controller')
const RedirectsController = () => import('#controllers/redirects_controller')

// index
router.get('/', [IndicesController])
router.get('/:code', [RedirectsController])
router.get('/:code/qrcode', [QRsController, 'getLinkQRcode'])
