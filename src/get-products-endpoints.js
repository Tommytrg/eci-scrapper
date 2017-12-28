const _    = require('lodash')
const fs   = require('fs')
const Xray = require('x-ray')

const endpoints = require('../config/endpoints')
const x = Xray()

async function getProductEndpoints () {
  const keys = Object.keys(endpoints);
  for (let key of keys) {
    await getData(endpoints[key], key);
  }
}

function getData(endpoint, file) {
   return x(endpoint, '.js-plp', ['.link@href'])
    .paginate('a[rel=next]@href')
    .then(function(res) {
      console.log(`Writing data from ${endpoint} in file ${file}`)
      fs.writeFileSync(`./../data/${file}.json`, JSON.stringify({endpoints: res}), 'utf-8')
    })
    .catch(function (err) {
      console.log(`ERROR writing data from ${endpoint} in file ${file}`);
      console.log(err)
    })
    .delay(2000)
  }
  
getProductEndpoints()