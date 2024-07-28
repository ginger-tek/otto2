export default {
  template: `<pv-table :items="defs" :fields="fields">
    <template #name="{id,name}">
      <router-link :to="'/definitions/'+id">{{ name }}</router-link>
    </template>
  </pv-table>`,
  setup() {
    const defs = Vue.ref([])
    const fields = [
      'name',
      'created',
      'updated'
    ]

    async function getDefs() {
      defs.value = await fetch('/api/definitions').then(r=>r.json())
    }

    Vue.onBeforeMount(getDefs)

    return {
      defs,
      fields
    }
  }
}