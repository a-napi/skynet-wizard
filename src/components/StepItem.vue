<template>
  <div class="item-wrapper">
    <div class="">
      <hr class="top-line" />
    </div>
    <h3 class="item-title" @click="makeActive" :class="{'non-active': Number(stepNumber) !== Number(currentStep)}">
      {{step.title}}
    </h3>
    <template v-if="Number(stepNumber) === Number(currentStep)">
      <div v-for="(variant, variantIndex) in step.variants" :key="variant.title" class="variant-wrapper" :style="'border-color: ' + variant.color">
        <div class="variant-top">
          <h3 class="variant-title">{{variant.title}}</h3>
          <h3 class="variant-price">{{variant.price || variant.price_default}} ₽</h3>
        </div>
        <div class="variant-body">
          <div class="variant-description" v-html="reformatDescriptionLineBreaks(variant.description)">
          </div>
          <div class="variant-menu">
            <template v-if="variant.options && variant.options.length">
              <div v-for="(option, optionIndex) in variant.options" class="variant-option" :key="option.title">
                <input type="checkbox" @click="changeOptionStatus(variantIndex, optionIndex, $event)" :checked="option.checked">
                <span>{{option.title}}</span>
              </div>
            </template>
            <template v-if="variant.select && variant.select.length">
              <template v-for="(select, selectIndex) in variant.select">
                <div class="select-description" :key="select.title">
                  {{select.title}}
                </div>
                <select class="select" @change="onSelectChange(variantIndex, selectIndex, $event)" :key="selectIndex + '-' + select.title" name="" id="">
                  <template v-for="(item, itemIndex) in select.items">
                    <option :key="item.title" :selected="item.checked" :value="itemIndex">{{item.title}}</option>
                  </template>
                </select>
              </template>
            </template>
            <div class="select-button-wrapper" >
              <button :class="{'variant-non-active': !variant.active}" class="select-button button-general" @click="makeVariantSelected(variantIndex)">
                <span v-if="variant.active">Выбрано</span>
                <span v-else>Выбрать</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </template>
  </div>
</template>

<script>
import TextFormatter from '../handlers/TextFormatter'
export default {
  name: 'StepItem',
  props: {
    step: {
      required: true,
      type: Object
    },
    stepNumber: {
      required: true,
      type: Number
    }
  },
  computed: {
    currentStep () {
      return this.$store.getters['progress/getStep']
    }
  },
  methods: {
    makeActive () {
      this.$store.commit('progress/CHANGE_STEP', this.stepNumber)
    },
    reformatDescriptionLineBreaks (text) {
      return TextFormatter.formatLineBreakers(text)
    },
    changeOptionStatus (variantIndex, optionIndex, e) {
      const data = {
        step: this.stepNumber,
        variant: variantIndex,
        option: optionIndex,
        checked: e.target.checked
      }
      this.$store.dispatch('wizard/checkOption', data)
      this.$emit('priceChanged')
    },
    makeVariantSelected (variantIndex) {
      const data = {
        step: this.stepNumber,
        variant: variantIndex
      }
      this.$store.dispatch('wizard/setActiveVariant', data)
      this.$emit('priceChanged')
      this.$store.commit('progress/ADD_STEP')
    },
    onSelectChange (variantIndex, selectIndex, e) {
      const data = {
        step: this.stepNumber,
        variant: variantIndex,
        select: selectIndex,
        item: e.target.value
      }
      this.$store.dispatch('wizard/checkSelectItem', data)
      this.$emit('priceChanged')
    }
  }
}
</script>

<style scoped>
  .item-wrapper {
    min-width: 400px;
    max-width: 100%;
    margin: 0 50px;
    display: flex;
    flex-direction: column;
  }
  .variant-wrapper {
    background-color: #F8F8F8;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    border-left: 10px solid #2FCB5A;
  }
  .variant-top {
    display: flex;
    justify-content: space-between;
  }
  .variant-body {
    display: flex;
    flex-direction: row;
  }
  .variant-description {
    width: 70%;
    border-right: 1px solid #777;
    text-align: left;
  }
  .variant-menu {
    width: 30%;
    padding: 0 5px 0 20px;
  }
  .variant-option {
    margin: 2px 0;
    border: 1px solid #333;
    padding: 5px 0;
    border-radius: 5px;
    text-align: left;
  }
  .select-button-wrapper {
    margin-top:20px;
  }
  .select-button {
    display: inline-block;
    width: 100%;
    padding: 10px;
  }
  .select-description {
    text-align: left;
  }
  .select {
    display: inline-block;
    width: 100%;
    padding: 5px 0;
    border-radius: 5px;
  }
  .item-title {
    text-align: left;
    cursor: default;
  }
  .non-active {
    color: #C1C1C1;
    cursor: pointer;
  }
  .variant-non-active {
    background-color: #98ABBA;
  }

</style>
