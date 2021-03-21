import firebase from 'firebase/app'

export default {
  state: {
    practiceLeaders: []
  },
  mutations: {
    createPracticeLeader (state, payload) {
      state.practiceLeaders.push(payload)
    },
    loadPracticeLeaders (state, payload) {
      state.practiceLeaders = payload
    }
  },
  actions: {
    async createPracticeLeader ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.firestore().collection('practiceLeaders').add(payload)
        commit('createPracticeLeader', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchPracticeLeaders ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let practiceLeaders = []
        await firebase.firestore().collection('practiceLeaders').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            practiceLeaders.push({
              id: doc.id,
              name: doc.data().name
            })
          })
        })
        commit('loadPracticeLeaders', practiceLeaders)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    practiceLeaders (state) {
      return state.practiceLeaders
    },
    getPracticeLeaderById: state => id => {
      return state.practiceLeaders.find(practiceLeader => practiceLeader.id === id)
    }
  }
}
