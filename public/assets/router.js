const routes = [
  { path: '/', component: () => import('./views/monitor.js') },
  { path: '/definitions', component: () => import('./views/definitions.js') },
  { path: '/definitions/:id', component: () => import('./views/definition.js') },
  { path: '/history', component: () => import('./views/history.js') }
]

const router = VueRouter.createRouter({
  routes,
  history: VueRouter.createWebHistory()
})

export default router