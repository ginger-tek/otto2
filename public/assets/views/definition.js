export default {
  template: `<pre>{{ def }}</pre>`,
  setup() {
    const route = VueRouter.useRoute()
    const def = Vue.ref({})

    async function getDef() {
      def.value = await fetch(`/api/definitions/${route.params.id}`).then(r => r.json())
    }

    Vue.onBeforeMount(getDef)

    return {
      def
    }
  }
}