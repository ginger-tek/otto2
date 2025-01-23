import { api } from '../../utils.js'

export default {
  template: `<div class="container">
    <article>
      <div style="display:flex;justify-content:space-between">
        <h2>Executors</h2>
        <a href="/executors/new" role="button">New Executor</a>
      </div>
      <pv-table :items="execs" :fields="fields">
        <template #name="{id,name}">
          <router-link :to="'/executors/'+id">{{ name }}</router-link>
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

    async function getExecs() {
      execs.value = await api('executors')
    }

    Vue.onBeforeMount(getExecs)

    return {
      execs,
      fields
    }
  }
}