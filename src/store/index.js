import Vue from 'vue'
import Vuex from 'vuex'

import wizard from './wizard'
import progress from './progress'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    wizard, progress
  }
})
