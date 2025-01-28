import { api } from '../utils.js'

export default {
  template: `<pv-modal v-model="show" @close="def.name = null">
    <template #header>
      <b>Create New Definition</b>
    </template>
    <form @submit.prevent="createDef">
      <label>Name
          <input type="text" v-model="def.name" required>
      </label>
      <div class="grid">
        <button type="reset" class="secondary" @click="show = false"><i class="bi bi-x"></i> Cancel</button>
        <button type="submit"><i class="bi bi-check2-circle"></i> Create</button>
      </div>
    </form>
  </pv-modal>
  <button type="button" @click="show = true"><i class="bi bi-plus-lg"></i> New Definition</button>`,
  setup() {
    const router = VueRouter.useRouter()
    const def = Vue.ref({ name: null })
    const show = Vue.ref(false)

    async function createDef() {
      const res = await api(`definitions`, 'POST', def.value)
      Vue.nextTick(() => {
        show.value = false
        router.replace(`/definitions/${res.id}`)
      })
    }

    return {
      def,
      createDef,
      show
    }
  }
}