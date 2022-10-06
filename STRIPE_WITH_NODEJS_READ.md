








[![How to Integrate Stripe Payment APIs Using Node.JS](https://www.bigscal.com/wp-content/uploads/2022/01/stripe-payment-2-845x321.jpg)](https://www.bigscal.com/wp-content/uploads/2022/01/stripe-payment-2.jpg)

# How to Integrate Stripe Payment APIs Using Node.JS



## Table of Content:

- [Types of payment method APIs](https://www.bigscal.com/blogs/backend-technology/how-to-integrate-stripe-payment-apis-using-node-js/#1)
- [Prerequisites](https://www.bigscal.com/blogs/backend-technology/how-to-integrate-stripe-payment-apis-using-node-js/#2)
- Getting started with stripe payment APIs
  - [Stripe Checkout](https://www.bigscal.com/blogs/backend-technology/how-to-integrate-stripe-payment-apis-using-node-js/#4)
  - Charges API
    - [Create customer](https://www.bigscal.com/blogs/backend-technology/how-to-integrate-stripe-payment-apis-using-node-js/#6)
    - [How to add new card](https://www.bigscal.com/blogs/backend-technology/how-to-integrate-stripe-payment-apis-using-node-js/#7)
    - [Create charges](https://www.bigscal.com/blogs/backend-technology/how-to-integrate-stripe-payment-apis-using-node-js/#8)
  - [Payment Intents API](https://www.bigscal.com/blogs/backend-technology/how-to-integrate-stripe-payment-apis-using-node-js/#9)

## Types of payment method APIs

Stripe offers three different types of payment method APIs. And those are,

1. Stripe Checkout
2. Charges API
3. Payment Intents API

## Prerequisites

- Install Node
- Get Stripe API keys
- Postman for API calling
- Install stripe dependencies

## Getting started with stripe payment APIs

### Stripe Checkout

- Here we’re going to see, An overview of stripe checkout, and how to build a simple checkout integration to accept one-time payments.

- Stripe Checkout is a payment page that has already been constructed.

- Accepting payments with stripe checkout consist of two steps.

  - Create a checkout session for what your customer intends to purchase.
  - Redirect your customer to a stripe-hosted payment form to complete their purchase.
    - ( Later you can optionally add a webhook handler to automate fulfillment of the purchase by sending an email.)

- This is an example of creating the checkout session on the server. Here we are using the stripe node client library. First, we configure the library with our stripe secret key then make an API call to create the checkout session object. Once the response is returned from the API that session variable will contain the data including an id that’s used to redirect from the front end.

- #### app.js

  - Define your route for API in the app.js file.

  - ```
    var indexRouter = require('./routes/index');
    app.use('/', indexRouter);
    ```

- #### routes / index.js

  - Create a checkout session for what your customer intends to purchase.

  - ```js
    var express = require('express');
    var router = express.Router();
    const stripe = require("stripe")('sk_test_51JINs1SHKFpjeywqugn3nyuLK1inUNc6uN5GJsN0ESwCahDK8uOSLhXgS0ezrTqPRp5TxaW2jynxhFWno7fPfOeV00Y5a48XSG');
    
    /* GET home page. */
    router.get('/', function(req, res, next) {
    	res.render('index', { title: 'Stripe Checkout Example' });
    });
    
    router.post('/create-checkout-session', async function(req, res, next) {
      try {
      const session = await stripe.checkout.sessions.create({
        customer: 'cus_KudUxj75qTue5P',
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [{
        price: 'price_1KEoG2SHKFpjeywqDvm3EbiI', // One time pricing
        quantity: req.body.quantity
        }],
        success_url: 'http://localhost:4900/success.html?id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:4900/cancel.html',
      })
      res.send({ id: session.id });
      } catch (e) {
      	throw new Error(e);
      }
    });
    
    module.exports = router;
    ```

- #### views / index.ejs

  - Redirect your customer to a stripe-hosted payment form to complete their purchase.

  - ```js
    var express = require('express');
    var router = express.Router();
    const stripe = require("stripe")('sk_test_51JINs1SHKFpjeywqugn3nyuLK1inUNc6uN5GJsN0ESwCahDK8uOSLhXgS0ezrTqPRp5TxaW2jynxhFWno7fPfOeV00Y5a48XSG');
    
    /* GET home page. */
    router.get('/', function(req, res, next) {
    	res.render('index', { title: 'Stripe Checkout Example' });
    });
    
    router.post('/create-checkout-session', async function(req, res, next) {
      try {
        const session = await stripe.checkout.sessions.create({
          customer: 'cus_KudUxj75qTue5P',
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [{
            price: 'price_1KEoG2SHKFpjeywqDvm3EbiI', // One time pricing
            quantity: req.body.quantity
          }],
          success_url: 'http://localhost:4900/success.html?id={CHECKOUT_SESSION_ID}',
          cancel_url: 'http://localhost:4900/cancel.html',
        })
        res.send({ id: session.id });
      } catch (e) {
        throw new Error(e);
      }
    });
    
    module.exports = router;
    ```

- #### success.html

  - If the payment is successful, the customer will be redirected to the success page.

  - ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
    <b>Success Page</b>
    </body>
    </html>
    ```

- #### cancel.html

  - ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
    <b>cancel Page</b>
    </body>
    </html>
    ```

- #### Output

  - ![Output](https://www.bigscal.com/wp-content/uploads/2022/01/6-1.png)
  - After clicking on the Checkout button.
  - ![Output](https://www.bigscal.com/wp-content/uploads/2022/01/7-1.png)

- #### success page:

  - ![Success Page](https://www.bigscal.com/wp-content/uploads/2022/01/8-1.png)
  - ![Success Page -](https://www.bigscal.com/wp-content/uploads/2022/01/9.png)

### Charges API

- Using Charges and payment Intent APIs you can create your payment flow.
- The Charges API is used to build basic payment flow without handling SCA or Strong customer authentication.

#### Steps to create stripe charges

- app.js

  - ```
    var indexRouter = require('./routes/index');
    app.use('/', indexRouter);
    ```

#### routes / index.js

- Define routes for creating customers, add a new card and create charges for customers.

  - ```
    var express = require('express');
    var router = express.Router();
    const STRIPEHANDLER = require('../controllers/stripeHandler');
    
    router.post('/create-Customer', STRIPEHANDLER.createNewCustomer);
    router.post('/add-Card', STRIPEHANDLER.addNewCard);
    router.post('/create-Charges', STRIPEHANDLER.createCharges);
    
    module.exports = router;
    ```

- ##### Create customer

- ```
  const Stripe_Key = "sk_test_51JINs1SHKFpjeywqugn3nyuLK1inUNc6uN5GJsN0ESwCahDK8uOSLhXgS0ezrTqPRp5TxaW2jynxhFWno7fPfOeV00Y5a48XSG";
  const stripe = require("stripe")(Stripe_Key);
  
  module.exports.createNewCustomer = async(req, res, next) =>{
  try{
  const customer = await stripe.customers.create({
  name: req.body.name,
  email: req.body.email,
  });
  res.status(200).send(customer);
  }catch(error){
  throw new Error(error);
  }
  }
  ```

- ![4](https://www.bigscal.com/wp-content/uploads/2022/01/4-2.png)

- ##### Create or add a new card

- ```
  module.exports.addNewCard = async(req, res, next) =>{
  const {
  customer_Id,
  card_Name,
  card_ExpYear,
  card_ExpMonth,
  card_Number,
  card_CVC,
  } = req.body;
  
  try {
  const card_Token = await stripe.tokens.create({
  card: {
  name: card_Name,
  number: card_Number,
  exp_month: card_ExpMonth,
  exp_year: card_ExpYear,
  cvc: card_CVC,
  },
  });
  
  const card = await stripe.customers.createSource(customer_Id, {
  source: `${card_Token.id}`,
  });
  
  return res.status(200).send({ card: card.id });
  } catch (error) {
  throw new Error(error);
  }
  }
  ```

- ![Create or add new card bigscal](https://www.bigscal.com/wp-content/uploads/2022/01/6-2.png)

- ##### Create charges

  - Using customer and card ID creates new charges.

  - ```
    module.exports.createCharges = async(req, res, next) =>{
    try{
    const createCharge = await stripe.charges.create({
    receipt_email: 'test@gmail.com',
    amount: 50*100, //USD*100
    currency: "inr",
    card: req.body.card_ID,
    customer: req.body.customer_Id,
    }); 
    res.send(createCharge);
    }catch(err){
    throw new Error(error);
    }
    }
    ```

  - ![create charges bigscal](https://www.bigscal.com/wp-content/uploads/2022/01/8-2.png)

- #### Output

- ![output](https://www.bigscal.com/wp-content/uploads/2022/01/9-1.png)

[![Hire NodeJs Developer](https://www.bigscal.com/wp-content/uploads/2022/01/Hire-Nodejd-Develpers-Bigscal.jpg)](https://www.bigscal.com/hire-developers/hire-nodejs-developer/)

### Payment Intents API

- The Charges API has been replaced with the Payment Intent API.
- Payment intent API provides Strong customer authentication or SCA.
- The Payment Methods API has replaced tokens, which were previously used to securely transmit customer card information.
- In this example, we will learn how to accept a one-time payment using payment intent.

#### index.js

```
var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51JINs1SHKFpjeywqugn3nyuLK1inUNc6uN5GJsN0ESwCahDK8uOSLhXgS0ezrTqPRp5TxaW2jynxhFWno7fPfOeV00Y5a48XSG');

router.post('/', async function(req, res, next) {
let paymentMethod = await stripe.paymentMethods.create({
type: 'card',
card: {
number: '4242424242424242',
exp_month: 9,
exp_year: 2022,
cvc: '314',
},
});
paymentIntent = await stripe.paymentIntents.create({
payment_method: paymentMethod.id,
amount: 75*100, // USD*100
currency: 'inr',
confirm: true,
payment_method_types: ['card'],
});

res.send(paymentIntent);
});

module.exports = router;
```

#### Call API

![call API](https://www.bigscal.com/wp-content/uploads/2022/01/2-2.png)

#### Output

![Output](https://www.bigscal.com/wp-content/uploads/2022/01/3-2.png)

This is the fully functional code for handling payments and related data. It’ll work properly if you simply replace the sandbox key with your Stripe API key.

Stripe, on the other hand, makes it incredibly simple to develop payment sites without ever having to deal with sensitive data like credit card information, as you’ve seen.





## Notes

### Is it even possible to have both one time payments and recurring payments on the same page with Stripe Checkout?

**Yes.** The key is you should pass **the correct options** to generate the corresponding Stripe Checkout session ID.

### How can I accomplish this?

- Backend: Have a function to accept **Stripe's price ID** and **payment mode** as input and return a Stripe Checkout session ID as the output.
- Frontend: Pass **payment mode** information to `/create-checkout-session.php`. (see the Note if you are unable to do so)

------

## Details

The following solution assuming that:

1. You generate a Stripe Checkout Session ID at the backend. That ID will then pass to `.createCheckoutSession()` in js frontend.
2. You have a 1-time product (let's call it *PAY*) and a recurrent subscription (let's call it *SUB*).

### Frontend

I think you are close. What you need to do is passing the `mode` information to your API endpoint as well:

```js
// Create a Checkout Session with the selected plan ID
var createCheckoutSession = function(priceId, mode) { // <-- add a mode parameter
  return fetch("./create-checkout-session.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      priceId: priceId,
      mode: mode // <-- passing the mode, e.g. 'payment' or 'subscription'
    })
  }).then(function(result) {
    return result.json();
  });
};
```

If so, each checkout button in the page should have corresponding info of the priceId and payment mode. You can do so by storing them using data attribute:

```html
<div data-stripe-priceid="price_yyy" data-stripe-mode="subscription">Recurrent</div>
<div data-stripe-priceid="price_zzz" data-stripe-mode="payment">1-time</div>
```

If so, you can get the data attributes by e.g. a `click` event.

**Note:** If you cannot add an extra param to indicate mode, you neeed to identify if the given price ID is a 1-time or recurrent product in the backend. See https://stripe.com/docs/api/prices/object?lang=php#price_object-type for more details.

### Backend

Here are 2 sample code snippets from Stripe's documentation. **Direct copying of them does not work**.

Reference for *PAY*: https://stripe.com/docs/checkout/integration-builder

```dart
$checkout_session = \Stripe\Checkout\Session::create([
  'payment_method_types' => ['card'],
  'line_items' => [[
    'price_data' => [
      'currency' => 'usd',
      'unit_amount' => 2000,
      'product_data' => [
        'name' => 'Stubborn Attachments',
        'images' => ["https://i.imgur.com/EHyR2nP.png"],
      ],
    ],
    'quantity' => 1,
  ]],
  'mode' => 'payment',
  'success_url' => $YOUR_DOMAIN . '/success.html',
  'cancel_url' => $YOUR_DOMAIN . '/cancel.html',
]);
```

In your case, you may not need to define `'price_data'`. Instead, you should use `'price'`, like the next example.

Reference for *SUB*: https://stripe.com/docs/billing/subscriptions/checkout#create-session

```php
$checkout_session = \Stripe\Checkout\Session::create([
  'success_url' => 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
  'cancel_url' => 'https://example.com/canceled.html',
  'payment_method_types' => ['card'],
  'mode' => 'subscription',
  'line_items' => [[
    'price' => $body->priceId,
    // For metered billing, do not pass quantity
    'quantity' => 1,
  ]],
]);
```

1. Take a look at this reference: https://stripe.com/docs/api/checkout/sessions/create. For `line_items`, you can just simply using `'price'` and pass the price ID (e.g. `price_xxx`), which means your `'line_items'` will looks like this:

```php
'line_items' => [[
  'price' => $body->priceId,
  'quantity' => 1,
]],
```

For `'mode'`, use the value from your API request. It should be something like:

```php
'mode' => $body->mode
```

Which means in your backend you better define a function (e.g. `generate_checkout_session`) to:

- parse the json body received in the API request
- get `priceId` and `mode` from the parsed data
- use the `priceId` and `mode` in `\Stripe\Checkout\Session::create` and
- returns the `checkout_session` ID

Hope this (and the reference urls) can help you.