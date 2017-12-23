#!/usr/bin/env node
'use strict'
const cac = require('cac')
const update = require('update-notifier')
const pkg = require('./package')
const main = require('./')

const cli = cac()

cli.command('*', 'My Default Command', (input, flags) => {
  const options = Object.assign(
    {
      baseDir: input[0]
    },
    flags
  )

  main(options)
    .then(res => {
      const stats = res.toString(flags)
      if (!stats) {
        return console.log('No matched files.')
      }

      console.log(stats)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
})

cli
  .option('extensions', {
    desc: 'Specify extensions',
    alias: 'e',
    default: '*'
  })
  .option('limit', {
    desc: 'Limit output files',
    default: 100
  })

cli.parse()

update({ pkg }).notify()
