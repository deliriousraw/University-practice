import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import faculties from './modules/faculties'
import departments from './modules/departments'
import specialties from './modules/specialties'
import knowledgeBranches from './modules/knowledgeBranches'
import groups from './modules/groups'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    common,
    faculties,
    departments,
    specialties,
    knowledgeBranches,
    groups
  }
})
