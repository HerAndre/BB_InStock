
const express = require('express');
const router = express.Router();

const Mailchimp = require('mailchimp-api-v3')

const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

const { parse } = require('json2csv');
const fs = require('fs')

router.get('/', async function (req, res, next) {
  try {
    try {
      const { lists } = await mailchimp.get('/lists');
      res.json(lists)
    } catch (error) {
      throw ({ client: true, status: error.code, msg: error })
    }
    // mailchimp.get('/lists/cc8f0b8969/members')

  } catch (error) {
    next(error);
  }
});
router.get('/lists/:id/members', async function (req, res, next) {
  try {
    try {
      const fields = 'members.unique_email_id,members.interests,members.stats,members.member_rating,members.location.timezone'
      // const members = await mailchimp.get(`/lists/${req.params.id}/members?fields=${fields}&count=1000&offset=2000`, {
      const members = await mailchimp.get(`/lists/${req.params.id}/members?fields=${fields}&count=1`, {
        status : 'subscribed',
      });
      res.json(members)
    } catch (error) {
      throw ({ client: true, status: error.code, msg: error })
    }
  } catch (error) {
    next(error);
  }
});
// All members
// router.get('/lists/:id/members', async function (req, res, next) {
//   try {
//     try {
//       const countFields = 'total_items'
//       const { total_items } = await mailchimp.get(`/lists/${req.params.id}/members?fields=${countFields}&count=1`, {
//         status : 'subscribed',
//       });
//       console.log( total_items )

//       const fields = 'members.email_address,members.stats'
//       // const fields = 'members.unique_email_id,members.interests,members.stats,members.member_rating,members.location.timezone'
//       const paginationAmount = 1000;
//       const loopAmount = total_items/1000 + 1
//       const membersList = [];
//       const sleep = ms => new Promise(
//         resolve => setTimeout(resolve, ms));

//       for (let index = 0; index < loopAmount; index++) {
//         await sleep(3000);
//         const { members } = await mailchimp.get(`/lists/${req.params.id}/members?fields=${fields}&count=1000&offset=${index*paginationAmount}`, {
//           status : 'subscribed',
//         })
//         console.log(index);
//         membersList.push(...members)
//       }
//       console.log(membersList.length);
//       res.json(membersList)
//     } catch (error) {
//       throw ({ client: true, status: error.code, msg: error.message })
//     }
//   } catch (error) {
//     next(error);
//   }
// });

router.get('/reports', async function (req, res, next) {
  try {
    try {
      let campaigns = await mailchimp.get(`/reports?since_send_time=2020-01-01T00:00:00+00:00&before_send_time=2022-10-17T00:00:00+00:00&count=300/`)
      // removes campaigns with less than 30000 emails sent
      let i = campaigns.reports.length;
      while (i--) {
          let campaign = campaigns.reports[i];
          if (campaign.emails_sent < 30000 ){
              campaigns.reports.splice(i, 1);
          }
          if (campaign.bounces) {
            campaign.total_bounces = campaign.bounces.hard_bounces + campaign.bounces.soft_bounces
          }
          if (campaign.send_time) {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const weekNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            campaign.send_month = `${monthNames[new Date(campaign.send_time).getMonth()]}`
            campaign.send_month_numeric = `${new Date(campaign.send_time).getMonth()}`
            campaign.send_time = `${new Date(campaign.send_time).toLocaleDateString("en-US")}`
            campaign.send_day = `${weekNames[new Date(campaign.send_time).getDay()]}`
          }
          if (campaign.clicks) {
            campaign.click_rate = campaign.clicks.click_rate
          }
          if (campaign.opens) {
            campaign.open_rate = campaign.opens.open_rate
          }
          if (campaign.subject_line) {
            campaign.subject_line_length = campaign.subject_line.length
          }

      }
      try {
        const fields = ['reports'];
        const opts = { fields };
        const csv = parse(campaigns.reports);
        fs.writeFileSync('./scripts/reports.csv', csv)
      } catch (err) {
        console.error(err);
      }
      res.json(campaigns)
    } catch (error) {
      throw ({ client: true, status: error.code, msg: error })
    }
  } catch (error) {
    next(error);
  }
});

router.get('/campaigns', async function (req, res, next) {
  try {
    try {
      const fields = 'campaigns.id,campaigns.emails_sent,campaigns.settings.url,campaigns.settings.title,campaigns.send_time';
      let campaigns = await mailchimp.get(`/campaigns?since_send_time=2021-1-01T00:00:00+00:00&before_send_time=2021-5-01T00:00:00+00:00&count=5&fields=${fields}`)
      console.log(campaigns)
      // removes campaigns with less than 30000 emails sent
      let i = campaigns.campaigns.length;
      while (i--) {
          let campaign = campaigns.campaigns[i];
          if (campaign.emails_sent < 30000 ){
              campaigns.campaigns.splice(i, 1);
          }
      }
      res.json(campaigns)
    } catch (error) {
      throw ({ client: true, status: error.code, msg: error })
    }
  } catch (error) {
    next(error);
  }
});

router.get('/campaigns/:id', async function (req, res, next) {
  try {
    try {
      // const campaigns = await mailchimp.get(`/reports/${req.params.id}/sub-reports`)
      const campaigns = await mailchimp.get(`/reports/${req.params.id}/click-details`)
      // merges image and readmore entries for links.
      const reduced = campaigns.urls_clicked.reduce((acc, curr) => {
        const key = Object.keys(curr)[1] // "url"
        const value = Object.values(curr)[1] // value of url key
        let found = acc.find(i => i[key] === value)
        if (!found) {
            acc.push(curr)
        } else {
          // if same value is found then calculate new values and merge
            const totalClicks = found['total_clicks'] + curr['total_clicks'];
            const uniqueClicks = found['unique_clicks'] + curr['unique_clicks'];
            const campaignClicks = found['total_clicks']/found['click_percentage'];
            const campaignUniqueClicks = found['unique_clicks']/found['unique_click_percentage'];
            const clickPercentage = totalClicks/campaignClicks;
            const clickUniquePercentage = uniqueClicks/campaignUniqueClicks;

            // found[key] = [ ...found[key], ...curr[key] ]
            found['id'] = `${curr['id']}`;
            found['url'] = `${found['url']}`;
            found['total_clicks'] = totalClicks;
            found['click_percentage'] = clickPercentage;
            found['unique_clicks'] = uniqueClicks;
            found['unique_click_percentage'] = clickUniquePercentage;
            found['last_click'] = `${curr['last_click']}`;
        }
        return acc;
      }, [])
      campaigns.urls_clicked = reduced; // replace with calculations
      res.json(campaigns)

    } catch (error) {
      throw ({ client: true, status: error.code, msg: error })
    }
  } catch (error) {
    next(error);
  }
});

router.get('/campaigns/:id/click-details/:urlId', async function (req, res, next) {
  try {
    try {
      const { count, offset } = req.query
      const fields = 'members.email_address,members.clicks,members.url_id,members.email_id';
      const campaigns = await mailchimp.get(`/reports/${req.params.id}/click-details/${req.params.urlId}/members?fields=${fields}&count=${count}&offset=${offset}`)
      res.json(campaigns)
    } catch (error) {
      throw ({ client: true, status: error.code, msg: error })
    }
  } catch (error) {
    next(error);
  }
});


router.get('/test', async function (req, res, next) {
  try {
    try {
      // const test = await mailchimp.get(`/campaigns?since_send_time=2022-3-01T00:00:00+00:00`)
      const test = await mailchimp.get(`/reports/0c17380f6f/`)
      // const test = await mailchimp.get(`/reports/0094339253/click-details/c619097506/members`)
      res.json(test)
    } catch (error) {
      throw ({ client: true, status: error.code, msg: error })
    }
  } catch (error) {
    next(error);
  }
});



module.exports = router;