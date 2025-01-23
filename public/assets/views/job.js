import { api, toLocal, toTimeStr } from '../utils.js'

export default {
  template: `<div class="container">
    <article>
      <h2>Job</h2>
      <pv-tabs>
        <pv-tab>
          <template #title>
            Details
          </template>
          <table>
            <tbody>
              <tr>
                <th>Definition</th>
                <td><router-link :to="'/definitions/' + job.defId">Go to Definition</router-link></td>
              </tr>
              <tr>
                <th>Final Status</th>
                <td>{{ job.status }}</td>
              </tr>
              <tr>
                <th>Start Time</th>
                <td :title="job.startTime">{{ toLocal(job.startTime) }}</td>
              </tr>
              <tr>
                <th>End Time</th>
                <td :title="job.endTime">{{ toLocal(job.endTime) }}</td>
              </tr>
              <tr>
                <th>Elapsed Time</th>
                <td>{{ toTimeStr(job.elapsed) }}</td>
              </tr>
            </tbody>
          </table>
        </pv-tab>
        <pv-tab>
          <template #title>
            Standard Output
          </template>
          <button @click="getStdLog">Refresh</button>
          <textarea rows="20" style="font-family:monospace">{{ stdLog }}</textarea>
        </pv-tab>
        <pv-tab>
          <template #title>
            Error Output
          </template>
          <button @click="getErrLog">Refresh</button>
          <textarea rows="20" style="font-family:monospace">{{ errLog }}</textarea>
        </pv-tab>
      </pv-tabs>
    </article>
  </div>`,
  setup() {
    const route = VueRouter.useRoute()
    const stdLog = Vue.ref(null)
    const errLog = Vue.ref(null)
    const job = Vue.ref({

    })

    async function getJob() {
      job.value = await api(`jobs/${route.params.id}`)
      getStdLog()
      getErrLog()
    }
    
    async function getStdLog() {
      stdLog.value = await fetch(`/api/jobs/${job.value.id}/logs/std`).then(r => r.text())
    }
    
    async function getErrLog() {
      errLog.value = await fetch(`/api/jobs/${job.value.id}/logs/err`).then(r => r.text())
    }

    Vue.onBeforeMount(getJob)

    return {
      job,
      stdLog,
      errLog,
      toLocal,
      toTimeStr,
      getStdLog,
      getErrLog
    }
  }
}