const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

module.exports = yaml.load(fs.readFileSync(path.resolve(__dirname, '.eslintrc.yml'), 'utf8'))
