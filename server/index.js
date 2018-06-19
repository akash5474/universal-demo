require('colors')
const express = require('express')
const webpack = require('webpack')
const noFavicon = require('express-no-favicons')
const clientConfigProd = require('../webpack/client.prod')
const serverConfigProd = require('../webpack/server.prod')

const { publicPath } = clientConfigProd.output
const outputPath = clientConfigProd.output.path

const app = express()
app.use(noFavicon())

let isBuilt = false

const done = () =>
  !isBuilt &&
  app.listen(3000, () => {
    isBuilt = true
    console.log('BUILD COMPLETE -- Listening @ http://localhost:3000'.magenta)
  })

webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
  const clientStats = stats.toJson().children[0]
  const serverRender = require('../buildServer/main.js').default

  app.use(publicPath, express.static(outputPath))
  app.use(serverRender({ clientStats }))

  done()
})
