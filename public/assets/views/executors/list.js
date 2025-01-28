import { api, toLocal } from '../../utils.js'
import CreateExecutorModal from '../../components/createExecutorModal.js'

export default {
  components: { CreateExecutorModal },
  template: `<div class="container">
    <article>
      <div style="display:flex;justify-content:space-between">
        <h2>Executors</h2>
        <create-executor-modal></create-executor-modal>
      </div>
      <pv-table :items="execs" :fields="fields" :busy="loading">
        <template #name="{id,name}">
          <router-link :to="'/executors/'+id">{{ name }}</router-link>
        </template>
        <template #created="{created}">
          {{ toLocal(created) }}
        </template>
        <template #updated="{updated}">
          {{ toLocal(updated) }}
        </template>
      </pv-table>
    </article>
  </div>`,
  setup() {
    const execs = Vue.ref([])
    const fields = [
      'name',
      'created',
      'updated'
    ]
    const loading = Vue.ref(true)

    async function getExecs() {
      loading.value = true
      execs.value = await api('executors')
      loading.value = false
    }

    Vue.onBeforeMount(getExecs)

    return {
      execs,
      fields,
      toLocal,
      loading
    }
  }
}