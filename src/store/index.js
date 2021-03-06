import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import faculties from './modules/faculties'
import departments from './modules/departments'
import specialties from './modules/specialties'
import knowledgeBranches from './modules/knowledgeBranches'
import groups from './modules/groups'
import students from './modules/students'
import practices from './modules/practices'
import practiceLeaders from './modules/practiceLeaders'

Vue.use(Vuex)

const myPlugin = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem('store', JSON.stringify(state.students.students))
    localStorage.setItem('requests', JSON.stringify(state.students.requests))
  })
}

export default new Vuex.Store({
  modules: {
    user,
    common,
    faculties,
    departments,
    specialties,
    knowledgeBranches,
    groups,
    students,
    practices,
    practiceLeaders
  },
  plugins: [myPlugin]
})
