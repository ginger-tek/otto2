import { toLocal, toTimeStr } from '../utils.js'

export default {
  template: `<article>
    <pv-table :items="jobs" :fields="fields" :busy="loading" sort filter>
      <template #id="{id}">
        <router-link :to="'/jobs/'+id">View</router-link>
      </template>
      <template #def-name="{defId,defName}">
        <router-link :to="'/definitions/'+defId">{{ defName }}</router-link>
      </template>
      <template #status="{status}">
        <span :aria-busy="status == 'Running'">{{ status }}</span>
      </template>
      <template #start-time="{startTime}">
        {{ toLocal(startTime) }}
      </template>
      <template #end-time="{endTime}">
        {{ toLocal(endTime) }}
      </template>
      <template #elapsed="{elapsed}">
        {{ toTimeStr(elapsed) }}
      </template>
      <template #empty>
        No recent job executions to show
      </template>
    </pv-table>
  </article>`,
  setup() {
    const jobs = Vue.ref([])
    const fields = [
      { name: 'id', label: 'Job' },
      { name: 'defName', label: 'Definition' },
      'status',
      'startTime',
      'endTime',
      'elapsed'
    ]
    const loading = Vue.ref(true)
    const socket = io()

    Vue.onMounted(() => {
      socket.on('monitor-data', d => {
        jobs.value = d
        loading.value = false
      })
    })

    Vue.onUnmounted(() => {
      socket.disconnect()
    })

    return {
      jobs,
      fields,
      toLocal,
      toTimeStr,
      loading
    }
  }
}