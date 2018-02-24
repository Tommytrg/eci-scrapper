const getCategories = require('./get-categories')

const {send} = require('micro')

module.exports = async (req, res) => {
  const statusCode = 200
  const data = { message: 'Server running' }

  var MongoClient = require('mongodb').MongoClient

  var uri = 'mongodb+srv://tommytrg:12345@cluster0-7pxjz.mongodb.net/test'
  MongoClient.connect(uri, async function (err, client) {
    console.log('ERROR', err)
    const collection = client.db('eci')
    await getCategories.getProductEndpoints(collection)
    client.close()
  })
  await send(res, statusCode, data)
}
