import template from './sw-condition-has-custom-price.html.twig';

Shopware.Component.extend('sw-condition-has-custom-price', 'sw-condition-base', {
  template,

  computed: {
    selectValues() {
      return [
        {
          label: this.$tc('global.sw-condition.condition.yes'),
          value: true
        },
        {
          label: this.$tc('global.sw-condition.condition.no'),
          value: false
        }
      ];
    },
    hasCustomPrice: {
      get() {
        this.ensureValueExist();
        if (this.condition.value.hasCustomPrice == null) {
          this.condition.value.hasCustomPrice = false;
        }
        return this.condition.value.hasCustomPrice;
      },
      set(hasCustomPrice) {
        this.ensureValueExist();
        this.condition.value = {...this.condition.value, hasCustomPrice};
      },
    },
  },
});