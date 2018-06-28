'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const apiMocker = require('webpack-api-mocker')

module.exports = {
  devServer: {
    before: function(app) {

      var bodyParser = require('body-parser')
      app.use( bodyParser.json() );       // to support JSON-encoded bodies
      app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
      })); 

      let apiKey = 'AIzaSyBu6ShisHv8uABtNotv6BiQAJqcwHYIAc8'

      let apiResponse = {status: 'FAIL'}
      const https = require('https');

      app.post('/api/geocoding', function(req, res) {
        let address = req.body.address
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        https.get(url, (getRes) => {
          let body = '';
          getRes.on('data', (elem) => body += elem);
          getRes.on('end',() => {
            //console.log('\nbody: ' + body + '\n')
            let response = {
              url: url,
              data: JSON.parse(body),
              request: req.body
            };
            res.json(response)
          })
        });
      });

      app.post('/api/routing', function(req, res) {

        let p0 = `place_id:${req.body.places[0]}`
        let p1 = `place_id:${req.body.places[1]}`

        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${p0}&destinations=${p1}&mode=transit&transit_mode=train&key=${apiKey}`;
        
        https.get(url, (getRes) => {
          let body = '';
          getRes.on('data', (elem) => body += elem);
          getRes.on('end',() => {
            let response = {
              url: url,
              data: JSON.parse(body),
              request: req.body
            };
            res.json(response)
          })
        });

      });
    }
  },

  dev: {

    /*proxy: {
      '/backend': {
        target: 'https://api.backend.yourdomain.com'
      },
      '/analytics': {
        target: 'https://api.analytics.yourdomain.com'
      }
    },*/

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /*proxyTable: {
      // proxy all requests starting with /api to jsonplaceholder
      '/api': {
        target: 'http://localhost:8181',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },*/

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
