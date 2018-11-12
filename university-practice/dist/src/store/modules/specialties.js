import * as fb from 'firebase'

export default {
  state: {
    specialties: []
  },
  mutations: {
    createSpeciality (state, payload) {
      state.specialties.push(payload)
    },
    loadSpecialties (state, payload) {
      state.specialties = payload
    }
  },
  actions: {
    async createSpeciality ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const specialties = await fb.firestore().collection('specialties').add(payload)
        commit('createSpeciality', payload)
        commit('setLoading', false)
        console.log(specialties)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchSpecialties ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let specialties = []
        await fb.firestore().collection('specialties').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            specialties.push({
              id: doc.id,
              code: doc.data().code,
              name: doc.data().name
            })
          })
        })
        commit('loadSpecialties', specialties)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    specialties (state) {
      return state.specialties
    },
    getSpecialtyById: state => id => {
      return state.specialties.find(specialty => specialty.id === id)
    }
  }
}
