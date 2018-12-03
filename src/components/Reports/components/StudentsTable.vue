<template>
<div>
  <table id="export-table"
         ref="exportTable"
         style="text-align:center;"
         :data-cols-width="columnWidth"
         data-a-h="center"
         data-a-v="center">
        <tr><td colspan="9" contenteditable="true" data-a-h="center" data-f-sz="14" data-f-bold="true">Практика студентів НТУ</td></tr>
        <tr><td colspan="9" contenteditable="true" data-a-h="center" data-f-sz="12">2017 -  2018 навчальний рік</td></tr>
        <tr><td colspan="9" contenteditable="true" data-a-h="center">Бакалаври</td></tr>
        <tr><td colspan="9" contenteditable="true" data-a-h="center" data-f-bold="true">Кафедра філософії та педагогіки</td></tr>
        <tr>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center">№</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center">Прізвище</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center">Ім'я</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center">По батькові</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center" data-a-wrap="true">Форма навчання</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center" data-a-wrap="true">Трив. пр-ки</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center">База практики</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center">Керівник практики</td>
            <td contenteditable="true" data-b-t-s="medium" data-b-b-s="medium" data-f-bold="true" data-a-h="center" data-a-v="center" data-a-wrap="true">Відмітка практики</td>
        </tr>
        <tr>
            <td></td>
            <td data-f-bold="true" data-a-h="center" data-a-v="center">Факультет</td>
            <td colspan="2" data-f-italic="true" data-a-h="center" data-a-v="center" data-f-color="FFFF0000">економіки і права</td>
            <td colspan="6"></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF84C64F">Бакалаври</td>
            <td colspan="6"></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF0000FF">Група ІП-4-1-14</td>
            <td colspan="4" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF0000FF">Термін проходження з {{practiceStart}} по {{practiceFinish}}</td>
            <td colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF0000FF">Практика педагогічна</td>
        </tr>
        <tr v-for="(student, index) in students" :key="`student-${index}`">
            <td data-a-h="center">{{index+1}}</td>
            <td>{{student.lastname}}</td>
            <td>{{student.firstname}}</td>
            <td>{{student.surname}}</td>
            <td data-a-h="center">{{student.studyForm}}</td>
            <td data-a-h="center" data-t="n">{{student.practiceDuration}}</td>
            <td data-a-h="center">{{student.practicePlace}}</td>
            <td data-a-h="center">{{student.practiceLeader}}</td>
            <td data-a-h="center">{{student.practieStatus}}</td>
        </tr>
        <tr>
            <td colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center">Всього по кафедрі</td>
            <td colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center">пройшов</td>
            <td colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center"></td>
            <td colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center">не пройшов</td>
            <td colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center"></td>
            <td colspan="3" data-f-bold="true" data-a-h="center" data-a-v="center"></td>
        </tr>
        <tr>
          <td colspan="6" data-f-bold="true" data-a-h="right" data-a-v="center">Всього по кафедрі проходили практику</td>
          <td colspan="3" data-f-bold="true" data-a-h="left" data-a-v="center" data-f-color="FFFF0000">{{students.length}}</td>
        </tr>
        <tr>
          <td colspan="9"></td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2" data-f-bold="true" data-a-h="left" data-a-v="center">Завідувач кафедри</td>
          <td colspan="2"></td>
          <td colspan="3" data-f-bold="true" data-a-h="left" data-a-v="center">NAME</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="7" data-f-bold="true" data-a-h="left" data-a-v="center">дорожньо-будівельних матеріалів і хімії</td>
        </tr>
  </table>
  <button type="button" v-on:click="onexport">Excel download</button>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  data () {
    return {
      students: [{
        lastname: 'Веремієнко',
        firstname: 'Вадим',
        surname: 'Миколайович',
        studyForm: 'бюджет',
        practiceDuration: '3',
        practicePlace: 'Інформаційний обчислювальний центр',
        practiceLeader: 'Федін С.С.',
        practieStatus: 'Пройшов'
      },
      {
        lastname: 'Веремієнко',
        firstname: 'Вадим',
        surname: 'Миколайович',
        studyForm: 'бюджет',
        practiceDuration: '3',
        practicePlace: 'Інформаційний обчислювальний центр',
        practiceLeader: 'Федін С.С.',
        practieStatus: 'Пройшов'
      },
      {
        lastname: 'Веремієнко',
        firstname: 'Вадим',
        surname: 'Миколайович',
        studyForm: 'бюджет',
        practiceDuration: '3',
        practicePlace: 'Інформаційний обчислювальний центр',
        practiceLeader: 'Федін С.С.',
        practieStatus: 'Пройшов'
      },
      {
        lastname: 'Веремієнко',
        firstname: 'Вадим',
        surname: 'Миколайович',
        studyForm: 'бюджет',
        practiceDuration: '3',
        practicePlace: 'Інформаційний обчислювальний центр',
        practiceLeader: 'Федін С.С.',
        practieStatus: 'Пройшов'
      },
      {
        lastname: 'Веремієнко',
        firstname: 'Вадим',
        surname: 'Миколайович',
        studyForm: 'бюджет',
        practiceDuration: '3',
        practicePlace: 'Інформаційний обчислювальний центр',
        practiceLeader: 'Федін С.С.',
        practieStatus: 'Пройшов'
      },
      {
        lastname: 'Веремієнко',
        firstname: 'Вадим',
        surname: 'Миколайович',
        studyForm: 'бюджет',
        practiceDuration: '3',
        practicePlace: 'Інформаційний обчислювальний центр',
        practiceLeader: 'Федін С.С.',
        practieStatus: 'Пройшов'
      },
      {
        lastname: 'Веремієнко',
        firstname: 'Вадим',
        surname: 'Миколайович',
        studyForm: 'бюджет',
        practiceDuration: '3',
        practicePlace: 'Інформаційний обчислювальний центр',
        practiceLeader: 'Федін С.С.',
        practieStatus: 'Пройшов'
      }
      ],
      multipleSelection: []
    }
  },
  computed: {
    columnWidth: function () {
      const studentIndex = 3
      const lastname = this.findMax('lastname') + 2
      const firstname = Math.max(10, this.findMax('firstname'))
      const surname = this.findMax('surname') + 2
      const studyForm = 10
      const practiceDuration = 8
      const practicePlace = this.findMax('practicePlace') + 2
      const practiceLeader = Math.max(20, this.findMax('practiceLeader'))
      const practieStatus = 10
      return [studentIndex, lastname, firstname, surname, studyForm, practiceDuration, practicePlace, practiceLeader, practieStatus].join()
    },
    practiceStart: function () {
      return moment(this.startDate).format('DD.MM.YYYY')
    },
    practiceFinish: function () {
      return moment(this.finishDate).format('DD.MM.YYYY')
    }
  },
  methods: {
    findMax (field) {
      return this.students.reduce((max, student) => {
        return Math.max(max, student[field].length)
      }, 0)
    },
    onexport () {
      XLSX.utils.html.save_table_as_excel(this.$refs.exportTable, {name: 'test.xlsx'})
    }
  },
  mounted () {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://r954385f.beget.tech/xlsx_html.full.min.js')
    document.head.appendChild(recaptchaScript)
  }
}
</script>

