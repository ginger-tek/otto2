import { api, toLocal } from '../../utils.js'
import CreateDefinitionModal from '../../components/createDefinitionModal.js'

export default {
  components: { CreateDefinitionModal },
  template: `<div class="container">
    <article>
      <div style="display:flex;justify-content:space-between">
        <h2>Definitions</h2>
        <create-definition-modal></create-definition-modal>
      </div>
      <pv-table :items="defs" :fields="fields" :busy="loading">
        <template #name="{id,name}">
          <router-link :to="'/definitions/'+id">{{ name }}</router-link>
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
    const defs = Vue.ref([])
    const fields = [
      'name',
      'created',
      'updated'
    ]
    const loading = Vue.ref(true)

    async function getDefs() {
      loading.value = true
      defs.value = await api('definitions')
      loading.value = false
    }

    Vue.onBeforeMount(getDefs)

    return {
      defs,
      fields,
      toLocal,
      loading
    }
  }
}