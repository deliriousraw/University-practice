<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Добавить Новую Специальность</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field name="code"
                        label="Код"
                        type="text"
                        required
                        :rules="[v => !!v || 'Код специальности обязателен']"
                        v-model="code">
          </v-text-field>

          <v-text-field name="name"
                        label="Название Специальности"
                        type="text"
                        required
                        :rules="[v => !!v || 'Название специальности обязательно']"
                        v-model="name">
          </v-text-field>

          <v-select :items="knowledgeBranches"
                    v-model="knowledgeBrancheId"
                    label="Область знаний">
          </v-select>

        </v-form>
         <v-btn :disabled="!valid"
                class="success mb-3"
                @click="createSpeciality">
              Добавить специальность
        </v-btn>
        <v-layout row>
          <v-flex xs12>
            <v-list>
              <v-list-tile
                v-for="(item, index) in specialties"
                :key="`faculty-${index}`">

                <v-list-tile-action>
                  <v-icon color="green">star</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.code"></v-list-tile-sub-title>
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
      knowledgeBrancheId: null,
      valid: false
    }
  },
  computed: {
    specialties () {
      return this.$store.getters.specialties
    },
    knowledgeBranches () {
      return this.$store.getters.knowledgeBranches.map(knowledgeBranche => {
        return {
          text: `${knowledgeBranche.code} ${knowledgeBranche.name}`,
          value: knowledgeBranche.id
        }
      })
    }
  },
  methods: {
    createSpeciality () {
      if (this.$refs.form.validate()) {
        const specialty = {
          name: this.name,
          code: this.code,
          knowledgeBrancheId: this.knowledgeBrancheId
        }
        this.$store.dispatch('createSpeciality', specialty)
        this.clearFields()
      }
    },
    clearFields () {
      this.name = ''
      this.code = ''
      this.knowledgeBrancheId = null
    }
  }
}
</script>
<style lang="scss" scoped
</style>
