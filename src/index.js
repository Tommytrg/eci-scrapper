const getCategories = require('./get-categories')
const getProducts = require('./get-products')

const {send} = require('micro')
var MongoClient = require('mongodb').MongoClient

module.exports = async (req, res) => {
  const statusCode = 200
  const data = { message: 'Server running' }
  // scrapCategories()
  scrapProducts()
  await send(res, statusCode, data)
}

function scrapCategories () {
  var uri = 'mongodb+srv://tommytrg:12345@cluster0-7pxjz.mongodb.net/test'
  MongoClient.connect(uri, async function (err, client) {
    console.log('ERROR', err)
    const collection = client.db('eci')
    await getCategories.getProductEndpoints(collection)
    client.close()
  })
}

function scrapProducts () {
  var uri = 'mongodb+srv://tommytrg:12345@cluster0-7pxjz.mongodb.net/test'
  MongoClient.connect(uri, async function (err, client) {
    console.log('ERROR', err)
    const collection = client.db('eci')
    await getProducts.getProductsData(collection)
    // client.close()
  })
}
