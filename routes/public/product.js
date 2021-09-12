
const express = require('express');
const router = express.Router();
const bby = require('bestbuy')(process.env.BB_API_KEY);

const reducer = (obj, curr) => ({
  ...obj,
  [curr.name]: { name: curr.name, address: curr.address, distance: curr.distance },
});


router.get('/:id', async function (req, res, next) {
  try {
    try {
      const data = await bby.realTimeAvailability(req.params.id, { postalCode: req.query.postalCode });
      let { stores } = data;
      stores = stores.reduce(reducer, {});
      res.json(stores);
    } catch (error) {
      if (error.body && error.body.error) {
        throw ({ client: true, status: error.body.error.code, msg: error.body.error.message });
      } else {
        throw ({ client: true, status: error.status, msg: error.message });
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;