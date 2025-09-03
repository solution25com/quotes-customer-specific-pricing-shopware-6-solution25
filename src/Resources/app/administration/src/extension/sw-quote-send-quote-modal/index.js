import { Component } from 'Shopware';

Component.override('sw-quote-send-quote-modal', {
    created() {

        const originalTc = this.$tc;
        this.$tc = function (key, ...args) {
            if (key === 'sw-quote.detail.labelVAT') {
                return 'Tax';
            }

            return originalTc.call(this, key, ...args);
        };
    },
});
