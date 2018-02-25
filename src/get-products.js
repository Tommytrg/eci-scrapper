const Xray = require('x-ray')
const endpoints = require('../config/endpoints')

module.exports = {
  getProductsData
}
const x = Xray()

async function getProductsData (db) {
  const categories = Object.keys(endpoints)
  for (let key of categories) {
    await db.collection('pdp').find({ category: key }).toArray(async function (err, data) {
      console.log('err::::::', err)
      console.log('data:::::', data)
      if (err) {
        console.log(err)
      }
      for (let endpoint of data[0].pdps) {
        if (typeof endpoint === 'string') {
          await getProductData(endpoint, db)
        }
      }
    })
  }
}

function getProductData (endpoint, db) {
  return x(endpoint, 'body',
    {
      full_name: 'h1',
      name: 'h2',
      brand: '.pdp-title a',
      img: '#product-image-placer@src',
      price: '.prices-price',
      price_unit: '._pum',
      categories: ['ol li'],
      general_information: ['.info:nth-child(1) .info-list .info-item'],
      ingredients: ['.info:nth-child(2) .info-list .info-item'],
      // nutritional_information: ['.table-header'] // TBD
      conservation: '.infot-item',
      ean: '.pdp-reference span'
    }
  )
    .then(async function (res) {
      console.log('PRODUCT', res)
      await db.collection('product').updateOne(
        { full_name: res.full_name },
        { $set: res },
        { 'upsert': true },
        function (err, doc) {
          console.log('SAVING IN DB RESPONSE')
          if (err) {
            console.log(err)
          }
        })
    })
    .catch(function (err) {
      console.log(err)
    })
    .delay(1000)
}

getProductsData()
