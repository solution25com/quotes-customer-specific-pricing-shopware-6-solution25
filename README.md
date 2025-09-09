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

## Compatibility  

- ✅ Shopware 6.6.x , Shopware 6.7.x  


##  Get Started

### Prerequisites
 
> **Important Requirement**  
> The Quotes Customer Specific Pricing plugin requires the **Shopware Commercial** edition to function properly.  
> Make sure [Shopware Commercial](https://docs.shopware.com/en/shopware-6-en/extensions/shopware-commercial) is installed and active before proceeding.
 
---

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


**1. First we need to go to Customers -> Overview -> Select a Customer (ex. test,test) -> B2B Components and activate Quote Menagment**
<img width="1467" height="752" alt="Screenshot 2025-09-03 at 11 06 54" src="https://github.com/user-attachments/assets/3e699909-7d4a-44d9-8f40-d90ce1e00aaa" />

**2. Then when we add a product to cart , Request quote shows up we click on it**   
<img width="1465" height="756" alt="Screenshot 2025-09-03 at 11 14 40" src="https://github.com/user-attachments/assets/0bd99f19-b367-408a-bb9c-e3a2684c2a58" />

**Quote request shows up and we can leave a message if we want (optional), we click send**  
<img width="1466" height="757" alt="Screenshot 2025-09-03 at 11 19 55" src="https://github.com/user-attachments/assets/a3985266-52cb-43a4-baf2-ca7d7cebba9f" />

**The request is done and a Quote has been created .** 
<img width="1466" height="753" alt="Screenshot 2025-09-03 at 11 22 26" src="https://github.com/user-attachments/assets/c9731507-71bb-4cc5-bc76-749cd09a2f7b" /> 

**3. Then we go to Admin , Orders -> Quotes , and we will see the Quote number 1001 has been created and it’s on review**  

**We click on the quote 1001 , we can give a Offer price (gross) , if we want that price to be always for this customer then we select Persist Price or if we want for that price to apply just once we leave it unmarked .** 
<img width="1469" height="752" alt="Screenshot 2025-09-03 at 11 26 34" src="https://github.com/user-attachments/assets/6c589287-fd7a-4a44-9864-cebf7e3958d5" />
 

**We click on Send Quote , and we can add an expiry date and a message . When we fill those we can send it .** 
<img width="1467" height="752" alt="Screenshot 2025-09-03 at 11 29 00" src="https://github.com/user-attachments/assets/3618b953-4f16-4b64-97b2-8675cf50ce16" />

**4. Then if we go back to storefront , we can see that we replied , and the customer can chose if he wants that price to be applied by clicking place order , or decline it .** 
<img width="1464" height="750" alt="Screenshot 2025-09-03 at 11 31 00" src="https://github.com/user-attachments/assets/cde52243-725b-4fea-99d4-3d1314e2725e" />

**When we click place order , the price of the product now will show 5.00$**  
<img width="1462" height="752" alt="Screenshot 2025-09-03 at 11 33 11" src="https://github.com/user-attachments/assets/663d8fce-4735-43cb-b191-6fffcdbe2ae6" />

 
**When we make the payment , in the Customers -> Customer Specific Price we can see the new customer specific price :**  
<img width="1463" height="755" alt="Screenshot 2025-09-03 at 11 34 38" src="https://github.com/user-attachments/assets/231a2a02-4a4b-4ecc-9dd3-102362757dd2" />




