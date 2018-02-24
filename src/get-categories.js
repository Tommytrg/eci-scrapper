// const fs = require('fs')
const Xray = require('x-ray')
const R = require('ramda')
const endpoints = require('../config/endpoints')
const x = Xray()

module.exports = {
  getProductEndpoints
}

async function getProductEndpoints (db) {
  const keys = Object.keys(endpoints)
  for (let key of keys) {
    await getData(endpoints[key], key, db)
  }
}

function getData (endpoint, category, db) {
  return x(endpoint, '.js-plp', ['.link@href'])
    .paginate('a[rel=next]@href')
    .then(async function (res) {
      console.log(`SCRAPPING category: ${category}`)
      await db.collection('pdp').find({ category: category }).toArray(function (err, foundCategory) {
        if (err) console.log(`  ERROR searching category: $category`, err)
        if (foundCategory) {
          const pdps = foundCategory[0] ? foundCategory[0].pdps : []
          db.collection('pdp').updateOne(
            {category},
            { $set: { pdps: R.uniq([pdps, ...res]) } },
            function (err, doc) {
              console.log('SAVING IN DB RESPONSE')
              if (err) {
                console.log(`  ERROR saving new ${category} pdps`)
              }
              console.log(`  SUCCESS saving new ${category} pdps`)
            })
        }
      })
      // console.log(`Writing data from ${endpoint} in file ${category}`)
      // fs.writeFileSync(`./../data/categories/${category}.json`, JSON.stringify({endpoints: res}), 'utf-8')
    })
    .catch(function (err) {
      console.log(`ERROR writing data from ${endpoint} in file ${category}`)
      console.log(err)
    })
    .delay(1000)
}
