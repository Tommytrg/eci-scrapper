const fs = require('fs')

module.exports = {
  readJSON
}

function readJSON (name) {
  var fileName = name.includes('.json')
    ? name
    : (name + '.json')

  if (fs.existsSync(name)) {
    const data = fs.readFileSync(name, 'utf8')
    return JSON.parse(data)
  }
  return []
}
