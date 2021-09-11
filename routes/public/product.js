
const express = require('express');
const router = express.Router();
const bby = require('bestbuy')(process.env.BB_API_KEY);

const reducer = (obj, curr) => ({
  ...obj,
  [curr.name]: { name: curr.name, address: curr.address, distance: curr.distance },
});


router.get('/', async function (req, res, next) {
  try {
    const { body } = req;
    body.sku = 6451332;
    body.postalCode = 21032;
    const data = await bby.realTimeAvailability(body.sku, { postalCode: body.postalCode });
    let { stores } = data;
    stores = stores.reduce(reducer, {});
    res.json(stores);
  } catch (error) {
    next(error);
  }
});

module.exports = router;