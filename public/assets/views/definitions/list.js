import { api } from '../../utils.js'

export default {
  template: `<div class="container">
    <article>
      <div style="display:flex;justify-content:space-between">
        <h2>Definitions</h2>
        <a href="/definitions/new" role="button">New Definition</a>
      </div>
      <pv-table :items="defs" :fields="fields">
        <template #name="{id,name}">
          <router-link :to="'/definitions/'+id">{{ name }}</router-link>
        </template>
      </pv-table>
    </article>
  </div>`,
  setup() {
    const defs = Vue.ref([])
    const fields = [
      'name',
      'created',
      'updated'
    ]

    async function getDefs() {
      defs.value = await api('definitions')
    }

    Vue.onBeforeMount(getDefs)

    return {
      defs,
      fields
    }
  }
}