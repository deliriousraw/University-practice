import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '@/components/Home.vue'

import Login from '@/components/Auth/Login.vue'
import Register from '@/components/Auth/Register.vue'

import ApplicationForm from '@/components/Reports/ApplicationForm.vue'
import ReportForm from '@/components/Reports/ReportForm.vue'

import NewFaculty from '@/components/Faculties/NewFaculty.vue'
import NewDepartments from '@/components/Departmens/NewDepartment.vue'
import NewSpeciality from '@/components/Specialties/NewSpeciality.vue'
import NewKnowledgeBranches from '@/components/KnowledgeBranches/NewKnowledgeBranches.vue'
import NewGroups from '@/components/Groups/NewGroups.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: AuthGuard
    },
    {
      path: '/create/application',
      name: 'applicationform',
      component: ApplicationForm,
      beforeEnter: AuthGuard
    },
    {
      path: '/create/report',
      name: 'reportform',
      component: ReportForm,
      beforeEnter: AuthGuard
    },
    {
      path: '/create/faculty',
      name: 'newFaculty',
      component: NewFaculty,
      beforeEnter: AuthGuard
    },
    {
      path: '/create/departments',
      name: 'NewDepartments',
      component: NewDepartments,
      beforeEnter: AuthGuard
    },
    {
      path: '/create/speciality',
      name: 'NewSpeciality',
      component: NewSpeciality,
      beforeEnter: AuthGuard
    },
    {
      path: '/create/knowledge-branches',
      name: 'NewKnowledgeBranches',
      component: NewKnowledgeBranches,
      beforeEnter: AuthGuard
    },
    {
      path: '/create/groups',
      name: 'NewGroups',
      component: NewGroups,
      beforeEnter: AuthGuard
    }
  ],
  mode: 'history'
})
