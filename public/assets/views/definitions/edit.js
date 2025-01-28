import { api, toLocal, getTimeZoneOffsets } from '../../utils.js'

export default {
  template: `<div class="container">
    <article>
      <form @submit.prevent="saveDef">
        <div class="grid">
          <h2>{{ def.name || '...' }}</h2>
          <div class="grid">
            <button type="submit" style="width:auto"><i class="bi bi-floppy"></i> Save</button>
            <button type="button" class="secondary" @click="showDelete=true"><i class="bi bi-trash"></i> Delete</button>
          </div>
        </div>
        <label>
          <input v-model="def.enabled" type="checkbox" :true-value="1" :false-value="0">
          Enabled?
        </label>
        <label>Name
          <input type="text" v-model="def.name" required>
        </label>
        <pv-tabs stretch>
          <pv-tab>
            <template #title>
              <i class="bi bi-calendar2-week"></i> Schedule
            </template>
            <label>Timezone Offset
              <select v-model="def.schdTimezoneOffset">
              <option v-for="tz in getTimeZoneOffsets()" :value="tz.offset" :key="tz.timeZone">{{ tz.timeZone }}</option>
              </select>
            </label>
            <div class="grid">
              <label>Schedule Start Date/Time
                <fieldset role="group">
                  <input type="date" v-model="def.schdStartDate">
                  <input type="time" v-model="def.schdStartTime">
                </fieldset>
              </label>
              <label>Schedule End Date/Time
                <fieldset role="group">
                  <input type="date" v-model="def.schdEndDate">
                  <input type="time" v-model="def.schdEndTime">
                </fieldset>
              </label>
            </div>
            <label>Schedule Interval
              <input type="text" v-model="def.schdInterval">
              <small>
                <p>Syntax:</p>
                <ul>
                  <li>Time Interval: <code>{hours}:{minutes}</code> = "Run every x hours and x minutes"</li>
                  <li>Monthly Interval at start of day: <code>{n}st|nd|rd|th Sun|Mon|Tue|Wed|Thu|Fri|Sat</code> = "Run every nth day of the month at start of day"</li>
                  <li>Monthly Interval w/ Time of Day: <code>{n}st|nd|rd|th Sun|Mon|Tue|Wed|Thu|Fri|Sat @ {hour}:{minute} AM|PM</code> = "Run every nth day of the month at this time of day"</li>
                </ul>
              </small>
            </label>
          </pv-tab>
          <pv-tab>
            <template #title>
              <i class="bi bi-code-slash"></i> Script
            </template>
            <div class="grid">
              <label>Executor
                <select v-model="def.execId" required>
                  <option :value="null">Select one...</option>
                  <option v-for="exec in execs" :value="exec.id" :key="exec.name">{{ exec.name }}</option>
                </select>
              </label>
              <label>Script Type
                <select v-model="def.scriptType">
                  <option value="file">File</option>
                  <option value="inline">Inline</option>
                </select>
              </label>
            </div>
            <div class="grid">
              <label>Script
                <input v-if="def.scriptType == 'file'" type="text" style="font-family:monospace" v-model="def.script">
                <textarea v-else-if="def.scriptType == 'inline'" rows="20" style="font-family:monospace" v-model="def.script"></textarea>
              </label>
              <label v-if="def.scriptType == 'file'">Script Args
                <input type="text" v-model="def.scriptArgs">
              </label>
            </div>
          </pv-tab>
        </pv-tabs>
        <hr>
        <small>Created {{ toLocal(def.created) }}<br>Updated {{ toLocal(def.updated) }}</small>
      </form>
      <pv-modal v-model="showDelete" hide-close>
        <template #header>
          Delete Definition
        </template>
        Are you sure you want to delete this definition?
        <footer>
          <button class="secondary" @click="showDelete=false" :disabled="isDeleting">No</button>
          <button @click="deleteDef" :aria-busy="isDeleting" :disabled="isDeleting">Yes</button>
        </footer>
      </pv-modal>
    </article>
  </div>`,
  setup() {
    const route = VueRouter.useRoute()
    const router = VueRouter.useRouter()
    const execs = Vue.ref([])
    const def = Vue.ref({
      id: null,
      name: null,
      schdStartDate: null,
      schdStartTime: null,
      schdEndDate: null,
      schdEndTime: null,
      schdInterval: null,
      execId: null,
      script: null,
      scriptArgs: null,
      created: null,
      updated: null,
    })
    const showDelete = Vue.ref(false)
    const isDeleting = Vue.ref(false)

    async function getDef() {
      def.value = await api(`definitions/${route.params.id}`)
    }

    async function saveDef() {
      def.value = await api(`definitions`, 'PUT', def.value)
      PicoVue.appendToast('Definition saved successfully', { type: 'success' })
    }

    async function deleteDef() {
      isDeleting.value = true
      const { error, result } = await api(`definitions/${def.value.id}`, 'DELETE')
      if (result == true) {
        showDelete.value = false
        router.replace('/definitions')
        PicoVue.appendToast('Definition deleted successfully', { type: 'success' })
      } else if (error) {
        isDeleting.value = false
        PicoVue.appendToast('Failed to delete definition', { type: 'danger' })
      }
    }

    async function getExecs() {
      execs.value = await api('executors')
    }

    Vue.onBeforeMount(() => {
      getExecs()
      getDef()
    })

    return {
      def,
      getExecs,
      execs,
      saveDef,
      deleteDef,
      toLocal,
      showDelete,
      isDeleting,
      getTimeZoneOffsets
    }
  }
}