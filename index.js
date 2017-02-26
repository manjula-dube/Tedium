"use strict"

import express from 'express'
import bodyParser from 'body-parser'
import nunjucks from 'nunjucks'
import rp from 'request-promise'

let app = express()

app.use(express.static(`${__dirname}/public`))
app.set('view engine', 'html')

nunjucks.configure(`${__dirname}/src/views`, {
  autoescape: true,
  express   : app
})

const config = {
  port: 3001,
  env: 'dev'
}

app.get('/article', (req, res) => {
  res.send(Article.getArticles(15))
})

app.get('/', (req, res) => {
  rp('http://jsonplaceholder.typicode.com/posts?&_limit=4')
    .then((articles) => {
      res.render('index', { articles: JSON.parse(articles), bodyClass: 'home' })
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/articles/:id', (req, res) => {
  rp(`http://jsonplaceholder.typicode.com/posts/${req.params.id}`)
  .then((article) => {
    res.render('article', { article: JSON.parse(article), bodyClass: 'single' })
  })
  .catch((err) => {
    console.log(err)
  })
})

app.listen(config.port, () => {
  console.log(`server started on port ${config.port} (${config.env})`);
});
