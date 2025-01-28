export default {
  template: `<header>
    <nav>
      <ul>
        <li>
          <b>Otto</b>
        </li>
      </ul>
      <ul>
        <li>
          <router-link to="/monitor"><i class="bi bi-activity"></i> Monitor</router-link>
        </li>
        <li>
          <router-link to="/definitions"><i class="bi bi-files"></i> Definitions</router-link>
        </li>
        <li>
          <router-link to="/executors"><i class="bi bi-terminal"></i> Executors</router-link>
        </li>
        <li>
          <router-link to="/history"><i class="bi bi-clock-history"></i> History</router-link>
        </li>
      </ul>
    </nav>
  </header>
  <main>
    <router-view :key="route.path"/>
  </main>
  <pv-toaster/>`,
  setup() {
    const route = VueRouter.useRoute()

    return { route }
  }
}