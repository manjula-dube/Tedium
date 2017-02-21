"use strict"

import express from 'express'
import bodyParser from 'body-parser'
import nunjucks from 'nunjucks'

let app = express()

app.use(express.static(`${__dirname}/public`))
app.set('view engine', 'html')

nunjucks.configure(`${__dirname}/views`, {
  autoescape: true,
  express   : app
})

const config = {
  port: 3001,
  env: 'dev'
}

app.get('/', (req, res) => {
  res.render('index', {
    title : 'My First Nunjucks Page',
    articles : [
      { name : 'item #1', body: 'lorem upsdfg' },
      { name : 'item #2', body: 'lorem upsdfg' },
      { name : 'item #3', body: 'lorem upsdfg' },
      { name : 'item #4', body: 'lorem upsdfg' },
    ]
  });
})

app.listen(config.port, () => {
  console.log(`server started on port ${config.port} (${config.env})`);
});
