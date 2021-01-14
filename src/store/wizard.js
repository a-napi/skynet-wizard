import Vue from 'vue'
import WizardArray from '../data/WizardArray'
const wizard = {
  namespaced: true,
  state: {
    loaded: false,
    wizard: null
  },
  getters: {
    getWizard: state => state.wizard,
    isLoaded: state => state.loaded
  },
  mutations: {
    SET_WIZARD (state, value) {
      Vue.set(state, 'wizard', value)
    },
    SET_LOADED_STATUS (state, value) {
      state.loaded = value
    },
    SET_ACTIVE_VARIANT (state, data) {
      state.wizard[data.step].variants.forEach((variant, index) => {
        if (index === Number(data.variant)) {
          Vue.set(state.wizard[data.step].variants[index], 'active', true)
        } else {
          Vue.set(state.wizard[data.step].variants[index], 'active', false)
        }
      })
    },
    SET_CHECKED_OPTION (state, data) {
      const option = state.wizard[data.step].variants[data.variant].options[data.option]
      Vue.delete(option, 'checked')
      Vue.set(option, 'checked', data.checked)
    },
    SET_CHECKED_SELECT_ITEM (state, data) {
      state.wizard[data.step].variants[data.variant].select[data.select].items.forEach((item, index) => {
        if (index === Number(data.item)) {
          Vue.delete(item, 'checked')
          Vue.set(item, 'checked', true)
        } else {
          Vue.delete(item, 'checked')
          Vue.set(item, 'checked', false)
        }
      })
    },
    RECALCULATE_TOTAL_PRICE (state, data) {
      const activeVariant = state.wizard[data.step].variants[data.variant]
      console.log('activeVariant', activeVariant)
      if (activeVariant) {
        let totalPrice = activeVariant.price_default
        if (activeVariant.select && activeVariant.select.length) {
          activeVariant.select.forEach(select => {
            select.items.forEach(item => {
              if (item.checked) {
                totalPrice += Number(item.price)
              }
            })
          })
        }
        if (activeVariant.options && activeVariant.options.length) {
          activeVariant.options.forEach(option => {
            if (option.checked) {
              totalPrice += Number(option.price)
            }
          })
        }
        activeVariant.price = totalPrice
      }
    }
  },
  actions: {
    loadWizard ({ state, commit }) {
      if (state.loaded) return
      commit('SET_WIZARD', WizardArray)
      commit('SET_LOADED_STATUS', true)
    },
    setActiveVariant ({ commit }, data) {
      commit('SET_ACTIVE_VARIANT', data)
      commit('RECALCULATE_TOTAL_PRICE', data)
    },
    checkOption ({ commit }, data) {
      commit('SET_CHECKED_OPTION', data)
      commit('RECALCULATE_TOTAL_PRICE', data)
    },
    checkSelectItem ({ commit }, data) {
      commit('SET_CHECKED_SELECT_ITEM', data)
      commit('RECALCULATE_TOTAL_PRICE', data)
    }
  }
}

export default wizard
