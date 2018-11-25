import * as fb from 'firebase'

export default {
  state: {
    practices: []
  },
  mutations: {
    createPractice (state, payload) {
      state.practices.push(payload)
    },
    loadPractices (state, payload) {
      state.practices = payload
    }
  },
  actions: {
    async createPractice ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.firestore().collection('practices').add(payload)
        commit('createPractice', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchPractices ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let practices = []
        await fb.firestore().collection('practices').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            practices.push({
              id: doc.id,
              name: doc.data().name,
              facultyId: doc.data().facultyId
            })
          })
        })
        commit('loadPractices', practices)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    practices (state) {
      return state.practices
    },
    getPracticeById: state => id => {
      return state.practices.find(practice => practice.id === id)
    }
  }
}
