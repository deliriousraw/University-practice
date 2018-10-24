<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Добавить Новую Область Знаний</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field name="code"
                        label="Шифр"
                        type="number"
                        required
                        :rules="[v => !!v || 'Шифр Области Знаний обязателен']"
                        v-model="code">
          </v-text-field>

          <v-text-field name="name"
                        label="Название Области Знаний"
                        type="text"
                        required
                        :rules="[v => !!v || 'Название Области Знаний обязательно']"
                        v-model="name">
          </v-text-field>


        </v-form>
         <v-btn :disabled="!valid"
                  class="success mb-3"
                  @click="createKnowledgeBranch">
              Добавить Области Знаний
            </v-btn>
        <v-layout row>
          <v-flex xs12>
            <v-list>
              <v-list-tile
                v-for="(item, index) in knowledgeBranches"
                :key="`knowledgeBranche-${index}`">

                <v-list-tile-action>
                  <v-icon color="green">star</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="`${item.code} ${item.name}`"></v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      code: '',
      valid: false
    }
  },
  computed: {
    knowledgeBranches () {
      return this.$store.getters.knowledgeBranches
    }
  },
  methods: {
    createKnowledgeBranch () {
      if (this.$refs.form.validate()) {
        const knowledgeBranche = {
          name: this.name,
          code: this.code
        }
        this.$store.dispatch('createKnowledgeBranch', knowledgeBranche)
        this.clearFields()
      }
    },
    clearFields () {
      this.name = ''
      this.code = ''
    }
  }
}
</script>
<style lang="scss" scoped
</style>
