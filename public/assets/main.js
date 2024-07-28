import PicoVue from 'https://unpkg.com/@ginger-tek/picovue/picovue.js'
import App from './app.js'
import router from './router.js'

Vue.createApp(App)
  .use(router)
  .use(PicoVue)
  .mount('#app')