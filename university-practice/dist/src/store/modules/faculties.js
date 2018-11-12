import * as fb from 'firebase'

export default {
  state: {
    faculties: []
  },
  mutations: {
    createFaculty (state, payload) {
      state.faculties.push(payload)
    },
    loadFaculties (state, payload) {
      state.faculties = payload
    }
  },
  actions: {
    async createFaculty ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const faculties = await fb.firestore().collection('faculties').add(payload)
        console.log(faculties)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchFaculties ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let faculties = []
        await fb.firestore().collection('faculties').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            faculties.push({
              id: doc.id,
              name: doc.data().name,
              chief: doc.data().dekan
            })
          })
        })
        commit('loadFaculties', faculties)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    faculties (state) {
      return state.faculties
    },
    getFacultiesById: state => id => {
      return state.faculties.find(faculty => faculty.id === id)
    }
  }
}
