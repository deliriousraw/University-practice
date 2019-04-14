// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import * as fb from 'firebase'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  beforeCreate () {
    this.$store.commit('initialiseStore')
  },
  created () {
    var config = {
      apiKey: 'AIzaSyAy7nr1mhEESekmox9B1Pw6GXKKphSRt1k',
      authDomain: 'student-practice-cc645.firebaseapp.com',
      databaseURL: 'https://student-practice-cc645.firebaseio.com',
      projectId: 'student-practice-cc645',
      storageBucket: 'student-practice-cc645.appspot.com',
      messagingSenderId: '1004958443341'
    }

    fb.firestore(fb.initializeApp(config)).settings({
      timestampsInSnapshots: true
    })

    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    })

    this.$store.dispatch('fetchFaculties')
    this.$store.dispatch('fetchDepartments')
    this.$store.dispatch('fetchSpecialties')
    this.$store.dispatch('fetchKnowledgeBranches')
    this.$store.dispatch('fetchGroups')
    this.$store.dispatch('fetchPractices')
  }
})
