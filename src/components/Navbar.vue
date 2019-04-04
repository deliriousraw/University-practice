<template>
    <div>
        <v-navigation-drawer app temporary v-model="sideNavVisibility">
          <v-list>
            <v-list-tile v-for="(link, index) in (links.common)"
                         :key="`link-${index}`"
                         :to="link.url">
              <v-list-tile-action>
                <v-icon>{{link.icon}}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title v-text="link.title"></v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>
            <v-list-group v-if="isAdmin" prepend-icon="account_circle"
                           value="true">

              <v-list-tile slot="activator">
                <v-list-tile-title>Редагування</v-list-tile-title>
              </v-list-tile>

              <v-list-tile v-for="(link, index) in (links.dropdown)"
                         :key="`link-${index}`"
                         :to="link.url">
                <v-list-tile-action>
                  <v-icon>{{link.icon}}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="link.title"></v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
            </v-list-group>
            <v-list-tile v-if="isUserLoggedIn" @click="onLogout">
              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title v-text="'Выйти'"></v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <v-toolbar app dark color="primary">
            <v-toolbar-side-icon class="hidden-md-and-up" @click="sideNavVisibility = !sideNavVisibility"></v-toolbar-side-icon>
            <v-toolbar-title><v-btn flat to="/">Students Pratice</v-btn></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="isUserLoggedIn" class="hidden-sm-and-down">
              <v-btn v-for="(link, index) in links.common"
                     :key="`link-${index}`"
                     :to="link.url"
                     flat>
                     <v-icon left>{{link.icon}}</v-icon>
                     {{link.title}}
              </v-btn>
              <v-menu v-if="isAdmin" bottom left>
                <v-btn slot="activator"
                       dark
                       icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="(link, index) in links.dropdown"
                              :key="`link-${index}`"
                              :to="link.url">
                    <v-list-tile-action>
                      <v-icon>{{link.icon}}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title v-text="link.title"></v-list-tile-title>
                    </v-list-tile-content>

                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-btn v-if="isUserLoggedIn" @click="onLogout" flat>
                <v-icon left>exit_to_app</v-icon>
                Выйти
              </v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-if="!isUserLoggedIn" class="hidden-sm-and-down">
              <v-btn v-for="(link, index) in links"
                     :key="`link-${index}`"
                     :to="link.url"
                     flat>
                     <v-icon left>{{link.icon}}</v-icon>
                     {{link.title}}
              </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>

            <router-view></router-view>

        </v-content>
    </div>
</template>
<script>
export default {
  data () {
    return {
      sideNavVisibility: false
    }
  },
  computed: {
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    },
    isAdmin () {
      return this.$store.getters.user !== null && (this.$store.getters.user.id === '9gfq9NYoOSUBphiOhkCphlobKsn2' || this.$store.getters.user.id === 'v4RYrLYXXoMJq2Y3NmCq0dU724Q2')
    },
    links () {
      if (this.isUserLoggedIn) {
        return {
          common: [
            {title: 'Приказы', icon: 'create', url: '/create/application'},
            {title: 'Отчеты', icon: 'add', url: '/create/report'},
            {title: 'Список студентов', icon: 'add', url: '/students'}
          ],
          dropdown: [
            {title: 'Факультеты', icon: 'add', url: '/create/faculty'},
            {title: 'Кафедры', icon: 'add', url: '/create/departments'},
            {title: 'Специальности', icon: 'add', url: '/create/speciality'},
            {title: 'Области знаний', icon: 'add', url: '/create/knowledge-branches'},
            {title: 'Группы', icon: 'add', url: '/create/groups'},
            {title: 'Студент', icon: 'add', url: '/create/students'},
            {title: 'Практики', icon: 'add', url: '/create/practices'}
          ]
        }
      } else {
        return [
          {title: 'Войти', icon: 'account_box', url: '/login'},
          {title: 'Зарегистрироваться', icon: 'face', url: '/register'}
        ]
      }
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logoutUser')
      this.$router.push('/')
    }
  }
}
</script>
