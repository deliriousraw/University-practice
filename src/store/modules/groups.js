import * as fb from 'firebase'

export default {
  state: {
    groups: []
  },
  mutations: {
    createGroup (state, payload) {
      state.groups.push(payload)
    },
    loadGroups (state, payload) {
      state.groups = payload
    }
  },
  actions: {
    async createGroup ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.firestore().collection('groups').add(payload)
        commit('createGroup', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchGroups ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let groups = []
        await fb.firestore().collection('groups').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            groups.push({
              id: doc.id,
              alias: doc.data().alias,
              name: doc.data().name,
              facultyId: doc.data().facultyId
            })
          })
        })
        commit('loadGroups', groups)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    groups (state) {
      return state.groups
    },
    getGroupById: state => id => {
      return state.groups.find(group => group.id === id)
    }
  }
}
