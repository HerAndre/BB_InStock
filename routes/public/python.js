
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

router.post('/chart_open_rate_vs_week_day', async function (req, res, next) {
  try {
    const childPython = spawn('python', ['-u','./scripts/chart_open_rate_vs_week_day.py']);
    let output = '';
    childPython.stdout.on('data', (data) => {
      output += data;
    })
    childPython.stderr.on('data', (data) => {
      throw(data.toString())
    })
    childPython.on('close', (code) => {
      res.json(JSON.parse(output))
    })
  } catch (error) {
    next(error);
  }
});

router.post('/chart_open_rate_vs_month', async function (req, res, next) {
  try {
    const childPython = spawn('python', ['-u','./scripts/chart_open_rate_vs_month.py']);
    let output = '';
    childPython.stdout.on('data', (data) => {
      output += data;
    })
    childPython.stderr.on('data', (data) => {
      throw(data.toString())
    })
    childPython.on('close', (code) => {
      res.json(JSON.parse(output))
    })
  } catch (error) {
    next(error);
  }
});

router.post('/chart_open_rate_vs_subject_line_length', async function (req, res, next) {
  try {
    const childPython = spawn('python', ['-u','./scripts/chart_open_rate_vs_subject_line_length.py']);
    let output = '';
    childPython.stdout.on('data', (data) => {
      output += data;
    })
    childPython.stderr.on('data', (data) => {
      throw(data.toString())
    })
    childPython.on('close', (code) => {
      res.json(JSON.parse(output))
    })
  } catch (error) {
    next(error);
  }
});

router.post('/chart_open_rate_distribution', async function (req, res, next) {
  try {
    const childPython = spawn('python', ['-u','./scripts/chart_open_rate_distribution.py']);
    let output = '';
    childPython.stdout.on('data', (data) => {
      output += data;
    })
    childPython.stderr.on('data', (data) => {
      throw(data.toString())
    })
    childPython.on('close', (code) => {
      res.json(JSON.parse(output))
    })
  } catch (error) {
    next(error);
  }
});

router.post('/word_coeff_prediction', async function (req, res, next) {
  try {
    // console.log(req.body.subject)
    const childPython = spawn('python', ['-u','./scripts/word_coeff_prediction.py', req.body.subject]);
    let output = '';
    childPython.stdout.on('data', (data) => {
      output += data;
    })
    childPython.stderr.on('data', (data) => {
      throw(data.toString())
    })
    childPython.on('close', (code) => {
      res.json(JSON.parse(output))
    })
  } catch (error) {
    next(error);
  }
});

module.exports = router;