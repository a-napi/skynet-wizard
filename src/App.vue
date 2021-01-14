<template>
  <div id="app">
    <template v-if="wizardLoaded">
        <template v-for="(step, index) in wizard">
          <step-item :key="step.title"
                     :stepNumber="index"
                     :step="step"
                     @priceChanged="recalculateTotal"
          />
        </template>
    </template>
    <div class="next-button-wrapper">
      <button class="next-button button-general uppercase" :class="{'disabled-button': !finishedWizard}" :disabled="finishedWizard">
        <div class="">Итого к оплате</div>
        <div class="">{{totalPrice}} ₽</div>
      </button>
    </div>

  </div>
</template>

<script>
import StepItem from './components/StepItem'
export default {
  name: 'App',
  data () {
    return {
      totalPrice: 0
    }
  },
  created () {
    this.$store.dispatch('wizard/loadWizard')
  },
  methods: {
    recalculateTotal () {
      let price = 0
      this.wizard.forEach(step => {
        step.variants.forEach(variant => {
          if (variant.active) price += Number(variant.price)
        })
      })
      this.totalPrice = price
    }
  },
  computed: {
    wizard () {
      return this.$store.getters['wizard/getWizard']
    },
    wizardLoaded () {
      return this.$store.getters['wizard/isLoaded']
    },
    priceFilled () {
      const arrayOfPrices = []
      this.wizard.forEach(step => {
        step.variants.forEach(variant => {
          if (variant.active && variant.price !== undefined) arrayOfPrices.push(variant.price)
        })
      })
      return arrayOfPrices
    },
    finishedWizard () {
      if (this.wizard) { return this.wizard.length === this.priceFilled.length }
      return false
    }
  },
  components: {
    StepItem
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  width: 100%;
}
  .uppercase{
    text-transform: uppercase;
  }
  .button-general {
    background-color: #2FCB5A;
    outline: none;
    border: none;
    border-radius: 5px;
    color: #FFFFFF;
    cursor: pointer;
  }
  .next-button-wrapper {
    margin: 10px 0;
    padding: 0 50px;
  }
  .next-button {
    width: 100%;
    padding: 20px;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
  }
  .disabled-button {
    background-color: #C1C1C1;
  }
</style>
