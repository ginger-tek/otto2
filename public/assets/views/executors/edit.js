import { api, toLocal } from '../../utils.js'

export default {
  template: `<div class="container">
    <article>
      <form @submit.prevent="saveExec">
        <div class="grid">
          <h2>{{ exec.name || '...' }}</h2>
          <div class="grid">
            <button type="submit" style="width:auto">Save</button>
            <button type="button" class="secondary" @click="showDelete=true">Delete</button>
          </div>
        </div>
        <label>Name
          <input type="text" v-model="exec.name" required>
        </label>
        <label>Path
          <input type="text" v-model="exec.path" style="font-family:monospace" required>
        </label>
        <hr>
        <small>Created {{ toLocal(exec.created) }}<br>Updated {{ toLocal(exec.updated) }}</small>
      </form>
      <pv-modal v-model="showDelete" hide-close>
        <template #header>
          Delete Executor
        </template>
        Are you sure you want to delete this executor?
        <footer>
          <button class="secondary" @click="showDelete=false" :disabled="isDeleting">No</button>
          <button @click="deleteExec" :aria-busy="isDeleting" :disabled="isDeleting">Yes</button>
        </footer>
      </pv-modal>
    </article>
  </div>`,
  setup() {
    const route = VueRouter.useRoute()
    const router = VueRouter.useRouter()
    const exec = Vue.ref({
      id: null,
      name: null,
      created: null,
      updated: null,
    })
    const showDelete = Vue.ref(false)
    const isDeleting = Vue.ref(false)

    async function getExec() {
      exec.value = await api(`executors/${route.params.id}`)
    }

    async function saveExec() {
      exec.value = await api(`executors`, 'PUT', exec.value)
      PicoVue.appendToast('Definition saved successfully', { type: 'success' })
    }

    async function deleteExec() {
      isDeleting.value = true
      const { error, result } = await api(`executors/${exec.value.id}`, 'DELETE')
      if (result == true) {
        showDelete.value = false
        router.replace('/executors')
        PicoVue.appendToast('Definition deleted successfully', { type: 'success' })
      } else if (error) {
        isDeleting.value = false
        PicoVue.appendToast('Failed to delete definition', { type: 'danger' })
      }
    }

    Vue.onBeforeMount(getExec)

    return {
      exec,
      saveExec,
      deleteExec,
      toLocal,
      showDelete,
      isDeleting
    }
  }
}