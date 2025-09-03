// import '../core/component/sw-condition-has-custom-price';
Shopware.Application.addServiceProviderDecorator(
  'ruleConditionDataProviderService',
  (service) => {

    service.addCondition('lineItemHasCustomPrice', {
      component: 'sw-condition-generic',
      label: 'Item specific price',
      scopes: ['lineItem'],
      group: 'item',
    });

    return service;
  },
);