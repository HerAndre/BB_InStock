
const express = require('express');
const router = express.Router();
const { google } = require('googleapis')



router.get('/', async function (req, res, next) {
  try {
    const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
    const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'), scopes)

    const defaults = {
      auth: jwt,
      ids: 'ga:' + process.env.VIEW_ID,
    }
    const response = await jwt.authorize();

    const result = await google.analytics('v3').data.ga.get({
      ...defaults,
      'start-date': '30daysAgo',
      'end-date': 'today',
      'dimensions': 'ga:city',
      'metrics': 'ga:sessions'
    })
    res.json(result.data.rows.sort((a, b) => b[1] - a[1]));
  } catch (error) {
    next(error);
  }
});

module.exports = router;