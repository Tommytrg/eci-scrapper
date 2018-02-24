const fs = require('fs')
var jsonfile = require('jsonfile')

module.exports = {
  readJsonFilesFromDir
}

function readJsonFilesFromDir (dir, encode) {
  const type = encode || 'utf-8'
  const files = fs.readdirSync(dir, type)
  return files
    .map(file => jsonfile.readFileSync(`${dir}/${file}`))
}
