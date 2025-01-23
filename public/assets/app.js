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
          <router-link to="/monitor">Monitor</router-link>
        </li>
        <li>
          <router-link to="/definitions">Definitions</router-link>
        </li>
        <li>
          <router-link to="/executors">Executors</router-link>
        </li>
        <li>
          <router-link to="/history">History</router-link>
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