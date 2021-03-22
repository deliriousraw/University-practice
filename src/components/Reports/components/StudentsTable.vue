<template>
<div>
  <table id="export-table"
         ref="exportTable"
         style="text-align:center;"
         :data-cols-width="columnWidth"
         data-a-h="center"
         data-a-v="center">
        <tr><td colspan="9" contenteditable="true" data-a-h="center" data-f-sz="14" data-f-bold="true">Практика студентів НТУ</td></tr>
        <tr><td colspan="9" contenteditable="true" data-a-h="center" data-f-sz="12">2020 -  2021 навчальний рік</td></tr>
        <tr><td colspan="9" contenteditable="true" data-a-h="center">Бакалаври</td></tr>
        <tr><td colspan="9" contenteditable="true" data-a-h="center" data-f-bold="true">Кафедра {{department.name}}</td></tr>
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
            <td contenteditable="true" data-f-bold="true" data-a-h="center" data-a-v="center">Факультет</td>
            <td contenteditable="true" colspan="8" data-f-italic="true" data-a-h="left" data-a-v="left" data-f-color="FFFF0000">{{faculty.name}}</td>
        </tr>
        <tr>
            <td></td>
            <td contenteditable="true" colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF84C64F">Бакалаври</td>
            <td colspan="6"></td>
        </tr>
        <tr>
            <td></td>
            <td contenteditable="true" colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF0000FF">Група {{group}}</td>
            <td contenteditable="true" colspan="4" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF0000FF">Термін проходження з {{practiceStart}} по {{practiceFinish}}</td>
            <td contenteditable="true" colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center" data-f-color="FF0000FF">Практика /* Назва практики */</td>
        </tr>
        <tr v-for="(student, index) in parsedStudents" :key="`student-${index}`">
            <td contenteditable="true" data-a-h="center">{{index+1}}</td>
            <td contenteditable="true">{{student.lastname}}</td>
            <td contenteditable="true">{{student.firstname}}</td>
            <td contenteditable="true">{{student.surname}}</td>
            <td contenteditable="true" data-a-h="center">{{student.studyForm}}</td>
            <td contenteditable="true" data-a-h="center" data-t="n">{{practiceDuration}}</td>
            <td contenteditable="true" data-a-h="center">{{student.practicePlace}}</td>
            <td contenteditable="true" data-a-h="center">{{student.practiceLeader}}</td>
            <td contenteditable="true" data-a-h="center">{{student.practieStatus}}</td>
        </tr>
        <tr>
            <td contenteditable="true" colspan="2" data-f-bold="true" data-a-h="center" data-a-v="center">Всього по кафедрі</td>
            <td contenteditable="true" colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center">пройшов</td>
            <td contenteditable="true" colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center">{{passedStudents}}</td>
            <td contenteditable="true" colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center">не пройшов</td>
            <td contenteditable="true" colspan="1" data-f-bold="true" data-a-h="center" data-a-v="center">{{parsedStudents.length - passedStudents}}</td>
            <td contenteditable="true" colspan="3" data-f-bold="true" data-a-h="center" data-a-v="center"></td>
        </tr>
        <tr>
          <td contenteditable="true" colspan="6" data-f-bold="true" data-a-h="right" data-a-v="center">Всього по кафедрі проходили практику</td>
          <td contenteditable="true" colspan="3" data-f-bold="true" data-a-h="left" data-a-v="center" data-f-color="FFFF0000">{{students.length}}</td>
        </tr>
        <tr>
          <td colspan="9"></td>
        </tr>
        <tr>
          <td contenteditable="true" colspan="2"></td>
          <td contenteditable="true" colspan="2" data-f-bold="true" data-a-h="left" data-a-v="center">Завідувач кафедри</td>
          <td contenteditable="true" colspan="2"></td>
          <td contenteditable="true" colspan="3" data-f-bold="true" data-a-h="left" data-a-v="center">{{department.chief}}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td contenteditable="true" colspan="7" data-f-bold="true" data-a-h="left" data-a-v="center">{{department.name}}</td>
        </tr>
  </table>
  <v-btn  class="success mb-3"
          @click="onexport">
      Создать «Отчёт»
  </v-btn>
  <!-- <button type="button" v-on:click="onexport">Excel download</button> -->
  </div>
</template>
<script>
import moment from 'moment'
// import TableToExcel from '@linways/table-to-excel'

export default {
  props: {
    faculty: {
      type: Object,
      default: () => {}
    },
    department: {
      type: Object,
      default: () => {}
    },
    group: {
      type: String,
      default: ''
    },
    startDate: {
      type: String,
      default: ''
    },
    finishDate: {
      type: String,
      default: ''
    },
    students: {
      type: Array,
      default: () => []
    },
    practiceDuration: {
      type: String,
      default: ''
    }
  },
  computed: {
    parsedStudents () {
      return this.students.map(student => {
        return {
          ...student,
          firstname: student.fio.split(' ')[1],
          lastname: student.fio.split(' ')[0],
          surname: student.fio.split(' ')[2],
          practieStatus: student.practieStatus ? 'Пройшов' : 'Не пройшов'
        }
      }).sort((a, b) => {
        const first = a.fio.toLowerCase().trim()
        const second = b.fio.toLowerCase().trim()
        return (first < second) ? -1 : (first > second) ? 1 : 0
      })
    },
    passedStudents () {
      return this.parsedStudents.reduce((sum, current) => {
        return current.practieStatus ? sum + 1 : sum
      }, 0)
    },
    columnWidth: function () {
      const studentIndex = 3
      const lastname = Math.max(17, this.findMax('lastname') + 2)
      const firstname = Math.max(10, this.findMax('firstname'))
      const surname = this.findMax('surname') + 2
      const studyForm = 10
      const practiceDuration = 8
      const practicePlace = Math.max(15, this.findMax('practicePlace') + 2)
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
      return this.parsedStudents.reduce((max, student) => {
        return Math.max(max, student[field] ? student[field].length : 0)
      }, 0)
    },
    onexport () {
      // eslint-disable-next-line
      TableToExcel.convert(this.$refs.exportTable, {name: `Звіт ${this.group}.xlsx`})
    }
  }
}
</script>
<style>
#export-table {
  border-collapse: collapse;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)!important;
}
#export-table td {
  border: 1px solid rgba(0,0,0,.12);
  padding: 5px;
  background-color: #fff;
  color: black;
}
</style>


