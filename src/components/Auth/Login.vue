<template>
  <v-container>
     <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field prepend-icon="person"
                                name="email"
                                label="Login"
                                type="email"
                                :rules="emailRules"
                                v-model="email">
                  </v-text-field>
                  <v-text-field id="password"
                                prepend-icon="lock"
                                name="password"
                                label="Password"
                                type="password"
                                :counter="6"
                                :rules="passwordRules"
                                v-model="password">
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary"
                       @click="onSubmit"
                       :loading="loading"
                       :disabled="!valid || loading">
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      valid: false,
      emailRules: [
        v => !!v || 'Login is required'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be equal or than 6 characters'
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email !== 'deliriousraw@gmail.com' ? `${this.email.trim()}@universitypractice.ntu` : this.email,
          password: this.password
        }
        this.$store.dispatch('loginUser', user)
        .then(() => {
            this.$router.push('/')
            this.$store.dispatch('fetchFaculties')    
            this.$store.dispatch('fetchDepartments')
            this.$store.dispatch('fetchSpecialties')
            this.$store.dispatch('fetchKnowledgeBranches')
            // this.$store.dispatch('fetchPracticeLeaders')
            this.$store.dispatch('fetchGroups')
            this.$store.dispatch('fetchPractices')
        })
        .catch(() => {})
      }
    }
  },
  created () {
    if (this.$route.query['loginError']) {
      this.$store.dispatch('setError', 'Пожалуйста авторизируйтесь чтобы получить доступ к этой странице')
    }
  }
}
</script>
<style lang="scss" scoped
</style>
