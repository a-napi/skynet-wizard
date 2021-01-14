const progress = {
  namespaced: true,
  state: {
    step: 0
  },
  getters: {
    getStep: state => state.step
  },
  mutations: {
    ADD_STEP (state) {
      state.step += 1
    },
    CHANGE_STEP (state, value) {
      state.step = value
    }
  }
}

export default progress
