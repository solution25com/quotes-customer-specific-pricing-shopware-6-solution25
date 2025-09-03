import  './module/customer-specific-price';
import template from './extension/sw-quote-line-items/sw-quote-line-items.html.twig';
import './styles/base.scss'
import './decorator/rule-condition-service-decoration';
import './extension/sw-quote-send-quote-modal/index'
Shopware.Component.override('sw-quote-line-items', {
    template,
    created() {
        const originalTc = this.$tc;
        this.$tc = function (key, ...args) {
            if (key === 'sw-quote.detail.labelVAT') {
                return 'Tax';
            }

            return originalTc.call(this, key, ...args);
        };
    },
    computed: {
        columns() {
            const baseColumns = this.$super('columns');
            baseColumns.unshift({
                property: 'persistPrice',
                label: 'Quote Price',
                inlineEdit: true,
                sortable: false,
                align: 'right',
                allowResize: true,
            });
            const taxColumn = baseColumns.find(col => col.property === 'price.taxRules[0]');
            if (taxColumn) {
                taxColumn.label = this.$tc('Tax'); 
            }

            

            return baseColumns;
        },
    },
    methods: {
        getPersistPrice(item) {
            return item?.customFields?.persistPrice ?? false;
        },
        setPersistPrice(item, value) {
            if (!item.customFields) {
                item.customFields = {};
            }
            item.customFields.persistPrice = value;
        },
    },
});