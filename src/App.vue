<template>
  <v-app>
    <Navbar />
    <template v-if="error">
      <v-snackbar :multi-line="true"
                  :timeout="5000"
                  color="error"
                  @input="closeError"
                  :value="true">
        {{ error }}
        <v-btn dark
               flat
               @click.native="closeError">
          Close
        </v-btn>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import Navbar from './components/Navbar'

export default {
  components: {
    Navbar
  },
  beforeCreate () {
    this.$store.commit('initialiseStore')
  },
  created () {
    const user = firebase.auth().currentUser
    if (user) {
        this.$store.dispatch('autoLoginUser', user)
        this.$store.dispatch('fetchFaculties')    
        this.$store.dispatch('fetchDepartments')
        this.$store.dispatch('fetchSpecialties')
        this.$store.dispatch('fetchKnowledgeBranches')
        // this.$store.dispatch('fetchPracticeLeaders')
        this.$store.dispatch('fetchGroups')
        this.$store.dispatch('fetchPractices')
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    }
  }
}
</script>
