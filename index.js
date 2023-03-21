/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

module.exports = yaml.load(fs.readFileSync(path.resolve(__dirname, '.eslintrc.yml'), 'utf8'))
