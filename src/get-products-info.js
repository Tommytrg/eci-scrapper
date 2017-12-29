const fs = require('fs')
const Xray = require('x-ray')
const readJSON = require('./utils/read-json-async')

const x = Xray()

async function getProductsData () {
  const files = fs.readdirSync('../data/categories', 'utf-8')
  for (let file of files) {
    const categories = JSON.parse(fs.readFileSync(`../data/categories/${file}`, 'utf-8')).endpoints
    for (let category of categories) {
      await getProductData(category, file)
    }
  }
}

function getProductData (endpoint, file) {
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
    .then(function (res) {
      console.log(`Writing data from ${endpoint} in file ${file}`)
      const data = readJSON(`../data/products/${file}`)
      data.push(res)
      fs.writeFileSync(`../data/products/${file}`, [JSON.stringify(data)], 'utf8')
    })
    .catch(function (err) {
      console.log(`ERROR writing data from ${endpoint} in file ${file}`)
      console.log(err)
    })
    .delay(1000)
}

getProductsData()
