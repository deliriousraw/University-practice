import * as fb from 'firebase'

export default {
  state: {
    knowledgeBranches: []
  },
  mutations: {
    createKnowledgeBranch (state, payload) {
      state.knowledgeBranches.push(payload)
    },
    loadKnowledgeBranches (state, payload) {
      state.knowledgeBranches = payload
    }
  },
  actions: {
    async createKnowledgeBranch ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const knowledgeBranches = await fb.firestore().collection('knowledgeBranches').add(payload)
        commit('createKnowledgeBranch', payload)
        commit('setLoading', false)
        console.log(knowledgeBranches)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchKnowledgeBranches ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let knowledgeBranches = []
        await fb.firestore().collection('knowledgeBranches').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            knowledgeBranches.push({
              id: doc.id,
              code: doc.data().code,
              name: doc.data().name
            })
          })
        })
        commit('loadKnowledgeBranches', knowledgeBranches)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    knowledgeBranches (state) {
      return state.knowledgeBranches
    }
  }
}
