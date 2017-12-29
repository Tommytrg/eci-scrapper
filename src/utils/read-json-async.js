const fs = require('fs')

module.exports = {
  readJSON
}

function readJSON (name) {
  if (fs.existsSync(name)) {
    const data = fs.readFileSync(name, 'utf8')
    return JSON.parse(data)
  }
  return []
}
