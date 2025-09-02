[![Packagist Version](https://img.shields.io/packagist/v/solution25/quotes-customer-specific-pricing.svg)](https://packagist.org/packages/solution25/quotes-customer-specific-pricing)
[![Packagist Downloads](https://img.shields.io/packagist/dt/solution25/quotes-customer-specific-pricing.svg)](https://packagist.org/packages/solution25/quotes-customer-specific-pricing)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/solution25/quotes-customer-specific-pricing-shopware-6-solution25/blob/main/LICENSE)


# Quotes Customer Specific Pricing for Shopware 6

## Introduction

The **Quotes Customer Specific Pricing Plugin** allows merchants to define **individual product prices for specific customers** in Shopware 6.  
This is ideal for **B2B shops**, wholesale setups, or merchants who need flexible pricing per customer without modifying global product prices.

With this plugin, you can manage custom prices directly in the Shopware Admin, import/export prices via CSV, and ensure that customers always see their negotiated pricing when shopping.

---

## Key Features

### Customer-Specific Pricing
- Assign custom **net** and **gross** prices per product for individual customers.

### Easy Admin Management
- Add custom prices manually via the Shopware 6 administration panel.

### Import & Export via CSV
- Bulk manage custom prices with CSV import and export functions.

### Customer Quotes Support
- Supports special price handling for quotes and negotiations.

### Clear Overview
- View, edit, and manage all custom prices in a dedicated admin grid.

### Integration with Sales Channels
- Apply customer-specific prices across different sales channels.

---

##  Get Started

### Installation & Activation :

## GitHub

1. Clone the plugin into your Shopware plugins directory:
```bash
git clone https://github.com/solution25com/quotes-customer-specific-pricing-shopware-6-solution25.git
```

## Packagist
 ```
  composer require solution25/quotes-customer-specific-pricing
  ```
  

2. **Install the Plugin in Shopware 6**

- Log in to your Shopware 6 Administration panel.
- Navigate to Extensions > My Extensions.
- Locate the newly cloned plugin and click Install.

3. **Activate the Plugin**

- After installation, click Activate to enable the plugin.
- In your Shopware Admin, go to Settings > System > Plugins.
- Upload or install the “Quotes” plugin.
- Once installed, toggle the plugin to activate it.

4. **Verify Installation**

- After activation, you will see Quotes in the list of installed plugins.
- The plugin name, version, and installation date should appear.

  

## Accessing the Pricing Module

- Go to Customers > Customer-Specific Pricing in the Admin.
#### Use the buttons to:
- Add Custom Price manually
- Import CSV for bulk uploads
- Export CSV to back up or edit prices externally
- Example Admin View

- Customer Name: Assigns the price to a specific customer.
- Product: Select the product the price applies to.
- Net/Gross Price: Enter custom pricing values.
- Created At: Timestamp for when the entry was made.


