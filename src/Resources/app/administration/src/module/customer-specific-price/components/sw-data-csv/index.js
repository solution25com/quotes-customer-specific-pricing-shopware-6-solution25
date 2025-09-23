import template from './sw-data-csv.html.twig'
const { Component, Mixin } = Shopware;

Component.register('sw-data-csv', {
    template,
    inject: ["repositoryFactory"],
    mixins: [Mixin.getByName('notification')],
    emits: ["import-complete", "import-start", "import-finish"],
    data() {
        return {
            isProcessing: false,
            isExporting: false,
        };
    },
    methods: {
        triggerFileUpload() {
            this.$refs.csvFileInput.click();
        },

        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.$emit("import-start");
            await this.$nextTick();

            await new Promise((resolve) => setTimeout(resolve, 100));

            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvData = e.target.result;
                const parsedData = this.parseCSV(csvData);
                await this.processCSVData(parsedData);
                this.$emit("import-finish");
            };
            reader.readAsText(file);
        },

        parseCSV(csvData) {
            const lines = csvData.split("\n").filter(line => line.trim());
            const headers = lines[0].split(",").map((header) => header.trim());

            return lines.slice(1).map((line) => {
                const values = this.parseCSVLine(line);
                return headers.reduce((acc, header, index) => {
                    acc[header] = values[index] ? values[index].trim() : "";
                    return acc;
                }, {});
            }).filter(row => row["Customer ID"] && row["SKU"] && row["Custom WS Price"]);
        },

        parseCSVLine(line) {
            const values = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }

            values.push(current);
            return values;
        },

        async processCSVData(parsedData) {
            try {
                this.isProcessing = true;
                const totalRows = parsedData.length;
                let processedRows = 0;
                let successCount = 0;
                let errorCount = 0;

                const batchSize = 10;
                for (let i = 0; i < parsedData.length; i += batchSize) {
                    const batch = parsedData.slice(i, i + batchSize);

                    await Promise.all(batch.map(async (row) => {
                        try {
                            const customerId = await this.getCustomerUUID(row["Customer ID"]);
                            const productId = await this.getProductUUID(row["SKU"]);
                            const price = parseFloat(row["Custom WS Price"]);

                            if (customerId && productId && !isNaN(price)) {
                                await this.saveCustomPrice(customerId, productId, price);
                                successCount++;
                            } else {
                                errorCount++;
                                console.warn(`Skipped row - Customer: ${row["Customer ID"]}, Product: ${row["SKU"]}, Price: ${row["Custom WS Price"]}`);
                            }
                        } catch (error) {
                            console.error(`Error processing row: ${JSON.stringify(row)}`, error);
                            errorCount++;
                        }
                        processedRows++;
                    }));

                    if (processedRows % 50 === 0 || processedRows === totalRows) {
                        this.createNotificationInfo({
                            title: "Import Progress",
                            message: `Processed ${processedRows} of ${totalRows} rows...`,
                        });
                    }
                }

                this.createNotificationSuccess({
                    title: "Import Complete",
                    message: `Successfully imported ${successCount} records. ${errorCount > 0 ? `Failed: ${errorCount}` : ''}`,
                });
            } catch (error) {
                console.error("Import Error:", error);
                this.createNotificationError({
                    title: "Import Error",
                    message: "There was an issue importing the CSV file. Please try again.",
                });
            } finally {
                this.isProcessing = false;
            }
        },

        async getCustomerUUID(uuid) {
            const customerRepository = this.repositoryFactory.create("customer");
            const criteria = new Shopware.Data.Criteria(1, 1);
            criteria.addFilter(Shopware.Data.Criteria.equals("id", uuid));
            const customers = await customerRepository.search(criteria, Shopware.Context.api);
            return customers.total > 0 ? customers.first().id : null;
        },

        async getProductUUID(sku) {
            const productRepository = this.repositoryFactory.create("product");
            const criteria = new Shopware.Data.Criteria(1, 1);
            criteria.addFilter(Shopware.Data.Criteria.equals("productNumber", sku));
            const products = await productRepository.search(criteria, Shopware.Context.api);
            return products.total > 0 ? products.first().id : null;
        },

        async saveCustomPrice(customerId, productId, netPrice) {
            const customPriceRepository = this.repositoryFactory.create("custom_price");
            const taxRepository = this.repositoryFactory.create("tax");
            const productRepository = this.repositoryFactory.create("product");

            const product = await productRepository.get(productId, Shopware.Context.api);
            const tax = await taxRepository.get(product.taxId, Shopware.Context.api);
            const taxRate = tax.taxRate || 0;
            const grossPrice = netPrice * (1 + taxRate / 100);

            const existingCriteria = new Shopware.Data.Criteria(1, 1);
            existingCriteria.addFilter(Shopware.Data.Criteria.equals("customerId", customerId));
            existingCriteria.addFilter(Shopware.Data.Criteria.equals("productId", productId));

            const existingPrices = await customPriceRepository.search(existingCriteria, Shopware.Context.api);

            let customPrice;
            if (existingPrices.total > 0) {
                customPrice = existingPrices.first();
            } else {
                customPrice = customPriceRepository.create(Shopware.Context.api);
                customPrice.customerId = customerId;
                customPrice.productId = productId;
            }

            customPrice.price = [
                {
                    quantityStart: 1,
                    quantityEnd: null,
                    price: [
                        {
                            currencyId: Shopware.Context.app.systemCurrencyId,
                            net: parseFloat(netPrice.toFixed(2)),
                            gross: parseFloat(grossPrice.toFixed(2)),
                            linked: true,
                        },
                    ],
                },
            ];

            await customPriceRepository.save(customPrice, Shopware.Context.api);
        },

        async exportCSV() {
            this.isExporting = true;

            try {
                const customPriceRepository = this.repositoryFactory.create("custom_price");
                const allRecords = [];
                const limit = 500;

                const countCriteria = new Shopware.Data.Criteria(1, 1);
                const countResult = await customPriceRepository.search(countCriteria, Shopware.Context.api);
                const totalRecords = countResult.total;

                if (totalRecords === 0) {
                    this.createNotificationWarning({
                        title: "No Data",
                        message: "No custom prices found to export.",
                    });
                    this.isExporting = false;
                    return;
                }

                this.createNotificationInfo({
                    title: "Export Started",
                    message: `Exporting ${totalRecords} records...`,
                });

                const totalPages = Math.ceil(totalRecords / limit);

                for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
                    const criteria = new Shopware.Data.Criteria();
                    criteria.addAssociation("customer");
                    criteria.addAssociation("product");
                    criteria.setLimit(limit);
                    criteria.setPage(currentPage);

                    const pageResults = await customPriceRepository.search(criteria, Shopware.Context.api);
                    allRecords.push(...pageResults);

                    if (currentPage % 5 === 0 || currentPage === totalPages) {
                        this.createNotificationInfo({
                            title: "Export Progress",
                            message: `Fetched ${allRecords.length} of ${totalRecords} records...`,
                        });
                    }
                }

                const csvHeader = "Customer ID,Customer Tier Name,Customer Number,SKU,Product Name,Custom MSRP,Custom WS Price\n";
                const csvRows = allRecords.map((priceData) => {
                    const customerId = priceData.customerId || "N/A";
                    const customerName = priceData.customer ? `${priceData.customer.firstName} ${priceData.customer.lastName}` : "Unknown Customer";
                    const customerNumber = priceData.customer?.customerNumber || "N/A";
                    const sku = priceData.product?.productNumber || "N/A";
                    const msrp = '';
                    const productName = priceData.product?.name ? `"${priceData.product.name.replace(/"/g, '""')}"` : "Unknown Product";

                    let netPrice = "N/A";
                    if (
                        Array.isArray(priceData.price) &&
                        priceData.price.length > 0 &&
                        Array.isArray(priceData.price[0]) &&
                        priceData.price[0].length > 0
                    ) {
                        const rawNet = priceData.price[0][0].net ?? 0;
                        netPrice = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        }).format(rawNet);
                    }                    
                    
                    const escapedCustomerName = customerName.replace(/"/g, '""');

                    return `${customerId},"${escapedCustomerName}",${customerNumber},${sku},${productName},${msrp},${netPrice}`;
                });

                const csvContent = csvHeader + csvRows.join("\n");

                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const date = new Date();
                const formattedDate = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear().toString().slice(2)}`;
                const fileName = `M2 VB Display All Mageworx Custom Pricing - ${formattedDate}.csv`;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(url);

                this.createNotificationSuccess({
                    title: "Export Complete",
                    message: `Successfully exported ${allRecords.length} records.`,
                });

            } catch (error) {
                console.error("Export error:", error);
                this.createNotificationError({
                    title: "Export Error",
                    message: "Failed to export CSV. Please check the console for details.",
                });
            } finally {
                this.isExporting = false;
            }
        }
    }
});