const routes = [
  { path: '/', redirect: '/monitor' },
  { path: '/monitor', component: () => import('./views/monitor.js') },

  { path: '/definitions', component: () => import('./views/definitions/list.js') },
  { path: '/definitions/new', component: () => import('./views/definitions/create.js') },
  { path: '/definitions/:id', component: () => import('./views/definitions/edit.js') },

  { path: '/executors', component: () => import('./views/executors/list.js') },
  { path: '/executors/new', component: () => import('./views/executors/create.js') },
  { path: '/executors/:id', component: () => import('./views/executors/edit.js') },

  { path: '/jobs/:id', component: () => import('./views/job.js') },

  { path: '/history', component: () => import('./views/history.js') }
]

const router = VueRouter.createRouter({
  routes,
  history: VueRouter.createWebHistory()
})

export default router