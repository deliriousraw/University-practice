<template>
    <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Загрузить файл с текущим состянием БД</h1>
          <v-layout row>
            <v-flex>
              <v-select :items="options"
                        v-model="selectedOption"
                        label="Выберите сущность для сохранения">
              </v-select>
            </v-flex>
          </v-layout>

        <v-flex xs6>
            <v-btn class="warning" @click="saveGroups">
            Загрузить Back-up
            <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import saveAs from 'file-saver'

export default {
    name: 'DownloadBackup',
    data () {
        return {
            selectedOption: 'db',
            options: [
                { text: 'Вся База данных', value: 'db' },
                { text: 'Кафедры', value: 'departments' },
                { text: 'Факультеты', value: 'faculties' },
                { text: 'Группы', value: 'groups' },
                { text: 'Области Знаний', value: 'knowledgeBranches' },
                { text: 'Руководители Практик', value: 'practiceLeaders' },
                { text: 'Практики', value: 'practices' },
                { text: 'Специальности', value: 'specialties' },
                { text: 'Студенты', value: 'students' },
            ]
        }
    },
    computed: {
        backupData () {
            if (this.selectedOption === 'db') {
                return JSON.stringify({
                    departments: this.$store.getters.departments,
                    faculties: this.$store.getters.faculties,
                    groups: this.$store.getters.groups,
                    knowledgeBranches: this.$store.getters.knowledgeBranches,
                    practiceLeaders: this.$store.getters.practiceLeaders,
                    practices: this.$store.getters.practices,
                    specialties: this.$store.getters.specialties,
                    students: this.$store.getters.students,
                }, null, 2)
            } else {
                return JSON.stringify(this.$store.getters[this.selectedOption], null, 2)
            }
        }
    },
    methods: {
        saveToJson () {
            const blob = new Blob([this.backupData], {type: 'text/plain;charset=utf-8'})
            saveAs(blob, `${this.selectedOption}.json`)
        }
    }
}
</script>

<style>

</style>