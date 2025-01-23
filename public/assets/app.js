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
          <router-link to="/history">History</router-link>
        </li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <router-view/>
    </article>
  </main>`,
  setup() {

  }
}