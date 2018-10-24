<template>
    <div>
        <v-navigation-drawer app temporary v-model="sideNavVisibility">
          <v-list>
            <v-list-tile v-for="(link, index) in links"
                         :key="`link-${index}`"
                         :to="link.url">
              <v-list-tile-action>
                <v-icon>{{link.icon}}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title v-text="link.title"></v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>
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
            <v-toolbar-title>Students Pratice</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn v-for="(link, index) in links"
                     :key="`link-${index}`"
                     :to="link.url"
                     flat>
                     <v-icon left>{{link.icon}}</v-icon>
                     {{link.title}}
              </v-btn>
              <v-btn v-if="isUserLoggedIn" @click="onLogout" flat>
                <v-icon left>exit_to_app</v-icon>
                Выйти
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
    links () {
      if (this.isUserLoggedIn) {
        return [
          {title: 'Приказы', icon: 'create', url: '/create/application'},
          {title: 'Отчеты', icon: 'add', url: '/create/report'},
          {title: 'Факультеты', icon: 'add', url: '/create/faculty'},
          {title: 'Кафедры', icon: 'add', url: '/create/departments'},
          {title: 'Специальности', icon: 'add', url: '/create/speciality'},
          {title: 'Области знаний', icon: 'add', url: '/create/knowledge-branches'}
        ]
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
