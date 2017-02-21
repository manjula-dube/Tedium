"use strict"

import express from 'express'
import bodyParser from 'body-parser'

let app = express()

const config = {
  port: 3001,
  env: 'dev'
}

app.get('/', (req, res) => {
  res.send('It Works!')
})

app.listen(config.port, () => {
  console.log(`server started on port ${config.port} (${config.env})`);
});
