import { api } from '../../utils.js'

export default {
  template: `<div class="container">
    <article>
      <form @submit.prevent="createExec">
        <label>Name
          <input type="text" v-model="exec.name" required>
        </label>
        <button type="submit">Create</button>
      </form>
    </article>
  </div>`,
  setup() {
    const router = VueRouter.useRouter()
    const exec = Vue.ref({ name: null })

    async function createExec() {
      const res = await api(`executors`, 'POST', exec.value)
      router.replace(`/executors/${res.id}`)
    }

    return {
      exec,
      createExec
    }
  }
}