import { api } from '../utils.js'

export default {
  template: `<pv-modal v-model="show" @close="exec.name = null">
    <template #header>
      <b>Create New Executor</b>
    </template>
    <form @submit.prevent="createExec">
      <label>Name
        <input type="text" v-model="exec.name" required>
      </label>
      <div class="grid">
        <button type="reset" class="secondary" @click="show = false"><i class="bi bi-x"></i> Cancel</button>
        <button type="submit"><i class="bi bi-check2-circle"></i> Create</button>
      </div>
    </form>
  </pv-modal>
  <button type="button" @click="show = true"><i class="bi bi-plus-lg"></i> New Executor</button>`,
  setup() {
    const router = VueRouter.useRouter()
    const exec = Vue.ref({ name: null })
    const show = Vue.ref(false)

    async function createExec() {
      const res = await api(`executors`, 'POST', exec.value)
      Vue.nextTick(() => {
        show.value = false
        router.replace(`/executors/${res.id}`)
      })
    }

    return {
      exec,
      createExec,
      show
    }
  }
}