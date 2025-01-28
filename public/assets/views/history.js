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
        No job execution history to show
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
    
    async function getJobs() {
      loading.value = true
      jobs.value = await fetch('/api/jobs/history').then(r=>r.json())
      loading.value = false
    }

    Vue.onMounted(getJobs)

    return {
      jobs,
      fields,
      toLocal,
      toTimeStr,
      loading
    }
  }
}