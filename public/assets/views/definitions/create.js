import { api } from '../../utils.js'

export default {
  template: `<div class="container">
    <article>
      <form @submit.prevent="createDef">
        <label>Name
          <input type="text" v-model="def.name" required>
        </label>
        <button type="submit">Create</button>
      </form>
    </article>
  </div>`,
  setup() {
    const router = VueRouter.useRouter()
    const def = Vue.ref({ name: null })

    async function createDef() {
      const res = await api(`definitions`, 'POST', def.value)
      router.replace(`/definitions/${res.id}`)
    }

    return {
      def,
      createDef
    }
  }
}