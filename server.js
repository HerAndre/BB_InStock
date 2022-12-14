const express = require('express');
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');
const path = require('path');

require('dotenv').config();

const app = express();

const publicProduct = require('./routes/public/product');
const publicPython = require('./routes/public/python');
const publicStats = require('./routes/public/stats');
const publicmailChimp = require('./routes/public/mailChimp');

if (app.get('env') === 'production') {
  // trust first proxy
  app.set('trust proxy', 1);

  // redirect to https
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}
app.use(express.json({limit: '200mb'})); // default 1MB

const fs = require('fs');

app.use('/api/public/product', publicProduct);
app.use('/api/public/python', publicPython);
app.use('/api/public/stats', publicStats);
app.use('/api/public/mailChimp', publicmailChimp);

// configure the history fallback
app.use(history());

// All urls goto to index.html in /dist folder [build folder]
app.use("/", serveStatic(path.join(__dirname, 'web/dist')));

app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, 'web/dist/index.html'));
});


// error handler
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      err = {
        client: true,
        msg: 'Invalid JSON payload received',
        status: err.status,
      };
    }
    if (err.client) {
      // instance of validation error
      res.status(err.status || 400).json({ error: err.msg });
    } else {
      res
        .status(err.status || 500)
        .json({ error: 'There was an error with your request.' });
      next(err);
    }
    console.error(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on ${PORT}!`));

module.exports = app;