#!/usr/bin/env node
'use strict'
const cac = require('cac')
const prettyBytes = require('pretty-bytes')
const table = require('text-table')
const chalk = require('chalk')
const stringWidth = require('string-width')
const update = require('update-notifier')
const pkg = require('./package')
const main = require('./')

const cli = cac()

cli.command('*', 'My Default Command', (input, flags) => {
  const options = Object.assign({
    baseDir: input[0]
  }, flags)

  main(options)
    .then(res => {
      if (res.length === 0) {
        return console.log('No matched files.')
      }

      const output = [
        ['  File', 'Size', 'Gzip'].map(v => chalk.bold(v)),
        ['  ----', '----', '----'].map(v => chalk.dim(v))
      ].concat(res.slice(0, flags.limit || res.length).map(file => [
        '  ' + file.name,
        prettyBytes(file.size),
        chalk.green(prettyBytes(file.gzip))
      ]))

      if (flags.limit && res.length > flags.limit) {
        const count = res.length - flags.limit
        output.push([
          `  ...${count} more item${count > 1 ? 's' : ''} ${count > 1 ? 'are' : 'is'} hidden`,
          '',
          ''
        ].map(v => chalk.dim.italic(v)))
      }

      const size = res.reduce((sum, file) => sum + file.size, 0)
      const gzip = res.reduce((sum, file) => sum + file.gzip, 0)
      output.push(['  ----', '----', '----'].map(v => chalk.dim(v)))
      output.push([
        '  Total:',
        prettyBytes(size),
        chalk.green(prettyBytes(gzip))
      ])

      console.log()
      console.log(table(output, {
        stringLength: stringWidth
      }))
      console.log()
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
})

cli.option('extensions', {
  desc: 'Specify extensions',
  alias: 'e',
  default: 'js,css'
}).option('limit', {
  desc: 'Limit output files',
  default: 100
})

cli.parse()

update({ pkg }).notify()
