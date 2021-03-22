// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

const config = {
  apiKey: 'AIzaSyAy7nr1mhEESekmox9B1Pw6GXKKphSRt1k',
  authDomain: 'student-practice-cc645.firebaseapp.com',
  databaseURL: 'https://student-practice-cc645.firebaseio.com',
  projectId: 'student-practice-cc645',
  storageBucket: 'student-practice-cc645.appspot.com',
  messagingSenderId: '1004958443341'
}

firebase.firestore(firebase.initializeApp(config)).settings({timestampsInSnapshots: true})

let app

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
