<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>Новый Приказ</h1>
          <v-select :items="faculties"
                    v-model="facultyID"
                    label="Факультет">
          </v-select>
          <v-layout row>
            <v-flex xs4 class="mr-5">
              <v-select v-if="facultyID !== null"
                        :items="departments"
                        v-model="departmentID"
                        label="Кафедра">
              </v-select>
            </v-flex>
            <v-flex xs4 class="mr-5">
              <v-select v-if="facultyID !== null"
                        :items="groups"
                        v-model="groupID"
                        label="Группа">
              </v-select>
            </v-flex>
            <v-flex xs4>
              <v-select v-if="facultyID !== null"
                        :items="specialties"
                        v-model="specialtyID"
                        label="Специальности">
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4 class="mr-5">
              <v-text-field v-if="groupID !== null"
                            name="groupCourse"
                            label="Курс группы"
                            type="number"
                            min="1"
                            max="6"
                            v-model="groupCourse">
              </v-text-field>
            </v-flex>
            <v-flex xs4 class="mr-5">
              <v-text-field v-if="groupID !== null"
                            name="groupNumber"
                            label="Номер группы"
                            type="number"
                            min="1"
                            max="10"
                            v-model="groupNumber">
              </v-text-field>
            </v-flex>
            <v-flex xs4 class="mr-5">
              <v-switch v-if="groupID !== null"
                        :label="`Техникум`"
                        v-model="groupTeh">
              </v-switch>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 class="mr-5">
              <v-menu ref="menu"
                      :close-on-content-click="false"
                      v-model="startDateMenu"
                      :nudge-right="40"
                      :return-value.sync="startDate"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px">
                <v-text-field slot="activator"
                              v-model="startDate"
                              label="Дата початку практики"
                              prepend-icon="event"
                              readonly>
                </v-text-field>
                <v-date-picker v-model="startDate" no-title scrollable locale="ru-Ru">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu.save(startDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6>
              <v-menu ref="menu2"
                      :close-on-content-click="false"
                      v-model="finishDateMenu"
                      :nudge-right="40"
                      :return-value.sync="finishDate"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px">
                <v-text-field slot="activator"
                              v-model="finishDate"
                              label="Дата закінчення практики"
                              prepend-icon="event"
                              readonly>
                </v-text-field>
                <v-date-picker v-model="finishDate" no-title scrollable locale="ru-Ru">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="finishDate = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu2.save(finishDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-flex xs12>
            <v-textarea v-if="facultyID !== null && specialtyID !== null"
              solo
              name="text-before"
              label="Текст перед наказом"
              :value="textbeforeAPP"
              v-model="textbefore"
            ></v-textarea>
          </v-flex>
          <v-flex xs12>
            <v-textarea v-if="facultyID !== null && departmentID !== null"
              solo
              name="text-before"
              label="Текст після наказу"
              :value="textafterAPP"
              v-model="textafter"
            ></v-textarea>
          </v-flex>
          <v-flex xs12>
            <v-data-table v-model="selected"
                          :headers="headers"
                          :items="selectedStudents"
                          :pagination.sync="pagination"
                          select-all
                          item-key="fio"
                          class="elevation-1">
              <template slot="items" slot-scope="props">
                <tr>
                  <th>
                    <v-checkbox :input-value="props.all"
                                :indeterminate="props.indeterminate"
                                primary
                                hide-details
                                @click.native="toggleAll">
                    </v-checkbox>
                  </th>
                  <th v-for="header in props.headers"
                      :key="header.text"
                      :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                      @click="changeSort(header.value)">
                    <v-icon small>arrow_upward</v-icon>
                    {{ header.text }}
                  </th>
                </tr>
              </template>
              <template slot="items" slot-scope="props">
                <tr :active="props.selected" @click="props.selected = !props.selected">
                  <td>
                    <v-checkbox :input-value="props.selected"
                                primary
                                hide-details>
                    </v-checkbox>
                  </td>
                  <td class="text-xs-left">{{ props.item.fio }}</td>
                  <td class="text-xs-right">{{ getGroupName(props.item.groupID) }}</td>
                  <td class="text-xs-right">{{ props.item.groupCourse }}</td>
                  <td class="text-xs-right">{{ props.item.groupNumber }}</td>
                  <td class="text-xs-right">{{ props.item.practicePlace }}</td>
                  <td class="text-xs-right">{{ props.item.practiceLeader }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-btn :disabled="!facultyID"
                  class="success mb-3"
                  @click="createApplication()">
              Создать «Наказ»
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import * as docx from 'docx'
import saveAs from 'file-saver'

export default {
  data () {
    return {
      facultyID: null,
      departmentID: null,
      groupID: null,
      specialtyID: null,
      groupCourse: '',
      groupNumber: '',
      groupTeh: false,
      startDate: '',
      finishDate: '',
      startDateMenu: false,
      finishDateMenu: false,
      textbefore: '',
      textafter: '',
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      headers: [
        {
          text: 'Ф.И.О',
          align: 'left',
          sortable: false,
          value: 'fio'
        },
        { text: 'Группа', value: 'groupID' },
        { text: 'Курс', value: 'groupCourse' },
        { text: 'Номер группы', value: 'groupNumber' },
        {
          text: 'Предприятие',
          value: 'place',
          sortable: true
        },
        {
          text: 'Руководитель',
          value: 'leader',
          sortable: true
        }
      ]
    }
  },
  computed: {
    students () {
      return this.$store.getters.students.map(student => {
        return {
          id: student.id,
          fio: student.fio,
          facultyID: student.facultyID,
          groupID: student.groupID,
          specialtyID: student.specialtyID,
          groupCourse: student.groupCourse,
          groupNumber: student.groupNumber,
          groupTeh: student.groupTeh,
          level: student.level,
          studyForm: student.studyForm,
          financing: student.financing,
          startDate: student.startDate,
          practicePlace: student.practicePlace,
          practiceLeader: student.practiceLeader
        }
      })
    },
    selectedStudents () {
      let sorted = this.students
      if (this.facultyID) {
        sorted = sorted.filter(student => {
          return student.facultyID === this.facultyID
        })
      }
      // if (this.departmentID) {
      //   sorted = sorted.filter(student => {
      //     return student.specialtyID === this.departmentID
      //   })
      // }
      if (this.groupID) {
        sorted = sorted.filter(student => {
          return student.groupID === this.groupID
        })
        if (this.groupCourse.length !== 0) {
          sorted = sorted.filter(student => {
            return student.groupCourse === Number(this.groupCourse)
          })
          if (this.groupNumber.length !== 0) {
            sorted = sorted.filter(student => {
              return student.groupNumber === Number(this.groupNumber)
            })
          }
        }
      }
      return sorted
    },
    textbeforeAPP () {
      return `Згідно з навчальним  планом підготовки фахівців ОР «${this.isMasters ? 'Магістр' : 'Бакалавр'}» напряму ${this.specialty.code} «${this.specialty.name}» ${this.facultyTextForApplication} та графіку навчального процесу на ${new Date().getFullYear()}-${new Date().getFullYear() + 1} н.р.`
    },
    textafterAPP () {
      return `1.Направити студентів ${this.courseTextForApplication} курсу на переддипломну практику студентів, що виконують дипломну роботу по кафедрі ${this.department.name.toLowerCase()}.`
    },
    specialty () {
      return this.specialtyID !== null ? this.$store.getters.getSpecialtyById(this.specialtyID) : {code: '', name: ''}
    },
    faculty () {
      return this.facultyID !== null ? this.$store.getters.getFacultiesById(this.facultyID) : {name: ''}
    },
    department () {
      return this.departmentID !== null ? this.$store.getters.getDepartmentById(this.departmentID) : {name: '', chief: ''}
    },
    group () {
      return this.groupID !== null ? this.$store.getters.getGroupById(this.groupID) : {alias: '', facultyID: null}
    },
    faculties () {
      return this.$store.getters.faculties.map(faculty => {
        return {
          text: faculty.name,
          value: faculty.id
        }
      })
    },
    departments () {
      const filteredDepartments = this.$store.getters.departments.filter((department) => {
        return department.facultyId === this.facultyID
      })
      return filteredDepartments.map(department => {
        return {
          text: department.name,
          value: department.id
        }
      })
    },
    groupsLibrary () {
      return this.$store.getters.groups
    },
    groups () {
      const filteredGroups = this.$store.getters.groups.filter((group) => {
        return group.facultyId === this.facultyID
      })
      return filteredGroups.map(department => {
        return {
          text: department.alias,
          value: department.id
        }
      })
    },
    specialties () {
      return this.$store.getters.specialties.map(specialty => {
        return {
          text: `${specialty.code} ${specialty.name}`,
          value: specialty.id
        }
      })
    },
    isMasters () {
      return Number(this.groupCourse) > 4
    },
    courseForApplication () {
      return this.isMasters ? Number(this.groupCourse) - 4 : this.groupCourse
    },
    courseTextForApplication () {
      switch (Number(this.groupCourse)) {
        case 1 :
          return 'першого'
        case 2 :
          return 'другого'
        case 3 :
          return 'третього'
        case 4 :
          return 'четвертого'
        case 5 :
          return 'першого'
        case 6 :
          return 'другого'
        default :
          return ''
      }
    },
    facultyTextForApplication () {
      const faculty = this.$store.getters.getFacultiesById(this.facultyID)
      if (!faculty) {
        return ''
      } else if (faculty.name === 'Автомеханічний факультет') {
        return 'автомеханічного факультету'
      } else {
        let facultyText = faculty.name.split(' ')
        facultyText[0] = facultyText[0].toLowerCase() + 'у'
        return facultyText.join(' ')
      }
    }
  },
  methods: {
    getGroupName (groupID) {
      if (groupID !== null) {
        const group = this.groupsLibrary.find(group => {
          return group.id === groupID
        })
        return group.alias
      } else {
        return 'Без группы'
      }
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.students.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    createApplication () {
      // const faculty = this.$store.getters.getFacultiesById(this.facultyID)
      // const department = this.$store.getters.getDepartmentById(this.departmentID)
      const group = this.$store.getters.getGroupById(this.groupID)
      console.log('ok')
      const doc = new docx.Document({
        creator: 'НТУ',
        title: 'Наказ',
        description: `Наказ про проходження практики студентами групи ${group.alias}-${this.groupCourse}-${this.groupNumber}`
      })

      doc.Styles.createParagraphStyle('myStyles', 'My Styles')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .font('Times New Roman')
        .size(28)
        .color('000000')

      doc.Styles.createParagraphStyle('myStylesWithSpacing', 'My Styles')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .font('Times New Roman')
        .size(28)
        .color('000000')

      doc.Styles.createParagraphStyle('myHeading', 'My Styles')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .font('Times New Roman')
        .size(28)
        .center()
        .color('000000')
        .spacing({before: 240, after: 120})

      doc.Styles.createParagraphStyle('myHeadingWithoutAligning', 'My Styles')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .font('Times New Roman')
        .size(28)
        .color('000000')
        .spacing({before: 240, after: 120})

      const topFaculty = new docx.Paragraph('').style('myStyles')
      const topFacultytext1 = new docx.TextRun('Про направлення студентів').break()
      const topFacultytext2 = new docx.TextRun(`${this.facultyTextForApplication}`).break()
      const topFacultytext3 = new docx.TextRun('на практику').break()

      topFaculty.addRun(topFacultytext1)
      topFaculty.addRun(topFacultytext2)
      topFaculty.addRun(topFacultytext3)

      doc.addParagraph(topFaculty)

      const textBeforeApplication = new docx.Paragraph('').style('myStyles').justified()
      const textBeforeApplication1 = new docx.TextRun(`${this.textbefore}`).tab().break()
      textBeforeApplication.addRun(textBeforeApplication1)
      doc.addParagraph(textBeforeApplication)

      doc.createParagraph('НАКАЗУЮ:').style('myHeading').center()

      doc.createParagraph(`${this.textafter}`).center().style('myStyles')

      const groupText = new docx.Paragraph('').style('myHeading')
      const groupText1 = new docx.TextRun(`з ${this.formatDate(this.startDate)} р. по ${this.formatDate(this.finishDate)} р.`).break()
      groupText.addRun(groupText1)
      doc.addParagraph(groupText)

      doc.createParagraph(`${this.group.alias}-${this.courseForApplication}-${this.groupNumber}${this.isMasters ? 'м' : ''}${this.groupTeh ? 'тех.' : ''}`).style('myHeading').center()

      doc.createParagraph('Керівник практики').style('myHeading').left()

      doc.createParagraph('2. Кафедрі забезпечити студентів навчально-методичною літературою.').style('myStyles')
      doc.createParagraph('3. Проїзд та добові витрати на термін практики віднести за рахунок студентів згідно їх заяв.').style('myStyles')
      doc.createParagraph(`4. Контроль за виконанням наказу покласти на декана ${this.faculty.name} ${this.formatName(this.faculty.chief)}`).style('myStyles')

      const rector = new docx.Paragraph('').maxRightTabStop().style('myHeading')
      const rectorLeft = new docx.TextRun('Ректор')
      const rectorRight = new docx.TextRun('М. Ф. Дмитриченко').tab()
      rector.addRun(rectorLeft)
      rector.addRun(rectorRight)
      doc.addParagraph(rector)

      const footerText = new docx.Paragraph('').pageBreakBefore().style('myStyles')
      const footerText1 = new docx.TextRun('Наказ вносить:').break()
      const footerText2 = new docx.TextRun('Начальник ').break()
      footerText.addRun(footerText1)
      footerText.addRun(footerText2)
      doc.addParagraph(footerText)

      const navchMethod = new docx.Paragraph('').maxRightTabStop().leftTabStop(2268).style('myStyles')
      const navchMethodLeft = new docx.TextRun('навчально-методичного управління ').tab()
      const navchMethodRight = new docx.TextRun('О. П. Токін').tab()
      navchMethod.addRun(navchMethodLeft)
      navchMethod.addRun(navchMethodRight)
      doc.addParagraph(navchMethod)

      const footerAddText = new docx.Paragraph('').leftTabStop(0).style('myStyles')
      const footerAddText1 = new docx.TextRun('Погоджено:').tab().break()
      footerAddText.addRun(footerAddText1)
      doc.addParagraph(footerAddText)

      const navchMethod2 = new docx.Paragraph('').maxRightTabStop().leftTabStop(0).style('myStyles')
      const navchMethodLeft2 = new docx.TextRun('Проректор з навчальної роботи')
      const navchMethodRight2 = new docx.TextRun('О. К. Грищук').tab()
      navchMethod2.addRun(navchMethodLeft2)
      navchMethod2.addRun(navchMethodRight2)
      doc.addParagraph(navchMethod2)

      const navchMethod3 = new docx.Paragraph('').maxRightTabStop().leftTabStop(0).style('myStyles')
      const navchMethodLeft3 = new docx.TextRun(`Декан ${this.faculty.name}`)
      const navchMethodRight3 = new docx.TextRun(`${this.formatNameReverse(this.faculty.chief)}`).tab()
      navchMethod3.addRun(navchMethodLeft3)
      navchMethod3.addRun(navchMethodRight3)
      doc.addParagraph(navchMethod3)

      const navchMethod4 = new docx.Paragraph('').maxRightTabStop().leftTabStop(0).style('myStyles')
      const navchMethodLeft4 = new docx.TextRun(`Завідувач кафедри ${this.department.name.toLowerCase()}`)
      const navchMethodRight4 = new docx.TextRun(`${this.formatNameReverse(this.department.chief)}`).tab().break()
      navchMethod4.addRun(navchMethodLeft4)
      navchMethod4.addRun(navchMethodRight4)
      doc.addParagraph(navchMethod4)

      const packer = new docx.Packer()

      packer.toBlob(doc).then((blob) => {
        saveAs(blob, `Наказ для ${this.group.alias}-${this.groupCourse}-${this.groupNumber}.docx`)
      })
    },
    formatDate (date) {
      const created = new Date(date)
      const day = created.getDate() < 10 ? '0' + created.getDate() : created.getDate()
      const month = (created.getMonth() + 1) < 10 ? '0' + (created.getMonth() + 1) : created.getMonth() + 1
      const year = created.getFullYear()
      return `${day}.${month}.${year}`
    },
    formatName (name) {
      const nameArr = name.split(' ')
      return `${nameArr[0]} ${nameArr[1].charAt(0)}. ${nameArr[2].charAt(0)}.`
    },
    formatNameReverse (name) {
      const nameArr = name.split(' ')
      return `${nameArr[1].charAt(0)}. ${nameArr[2].charAt(0)}. ${nameArr[0]}`
    }
  },
  watch: {
    textbeforeAPP () {
      this.textbefore = this.textbeforeAPP
    },
    textafterAPP () {
      this.textafter = this.textafterAPP
    },
    facultyID () {
      this.departmentID = null
      this.groupID = null
      this.groupCourse = ''
      this.groupNumber = ''
    }
  }
}
</script>
<style lang="scss" scoped
</style>
