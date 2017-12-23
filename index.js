const path = require('path')
const globby = require('globby')
const pify = require('pify')
const prettyBytes = require('pretty-bytes')
const table = require('text-table')
const chalk = require('chalk')
const stringWidth = require('string-width')
const gzipSize = pify(require('gzip-size'))
// eslint-disable-next-line import/order
const fs = pify(require('fs'))

function toString(json, { limit, displayRelativePath, displayTotal }) {
  let output = [
    ['  File', 'Size', 'Gzip'].map(v => chalk.bold(v)),
    ['  ----', '----', '----'].map(v => chalk.dim(v))
  ].concat(
    json
      .slice(0, limit || json.length)
      .map(file => [
        '  ' +
          (displayRelativePath
            ? path.relative(process.cwd(), file.path)
            : file.name),
        prettyBytes(file.size),
        chalk.green(prettyBytes(file.gzip))
      ])
  )

  if (limit && json.length > limit) {
    const count = json.length - limit
    output.push(
      [
        `  ...${count} more item${count > 1 ? 's' : ''} ${count > 1
          ? 'are'
          : 'is'} hidden`,
        '',
        ''
      ].map(v => chalk.dim.italic(v))
    )
  }

  if (displayTotal) {
    const size = json.reduce((sum, file) => sum + file.size, 0)
    const gzip = json.reduce((sum, file) => sum + file.gzip, 0)
    output.push(['  ----', '----', '----'].map(v => chalk.dim(v)))
    output.push(['  Total:', prettyBytes(size), chalk.green(prettyBytes(gzip))])
  }

  output = table(output, {
    stringLength: stringWidth
  })

  return `\n${output}\n`
}

module.exports = function(
  { baseDir = 'dist', extensions = '*', sort = true, limit } = {}
) {
  baseDir = path.resolve(baseDir)

  if (typeof extensions === 'string') {
    extensions = extensions.split(',')
  }

  if (extensions.length > 1) {
    extensions = `{${extensions.join(',')}}`
  } else {
    extensions = extensions.join(',')
  }

  const statCache = {}
  return globby([`**/*.${extensions}`, '!**/node_modules/**'], {
    cwd: baseDir,
    nodir: true,
    statCache
  })
    .then(() => {
      return Promise.all(
        Object.keys(statCache).map(filepath => {
          const stat = statCache[filepath]
          return fs
            .readFile(filepath, 'utf8')
            .then(str => gzipSize(str))
            .then(size => {
              const name = path.relative(baseDir, filepath)
              return {
                path: filepath,
                name,
                size: stat.size,
                gzip: size
              }
            })
        })
      )
    })
    .then(res => {
      if (sort) {
        res = res.sort((a, b) => {
          return b.size - a.size
        })
      }

      return {
        toString({ displayRelativePath, displayTotal = true } = {}) {
          if (res.length === 0) return null
          return toString(res, { limit, displayRelativePath, displayTotal })
        },
        toJson() {
          return res
        }
      }
    })
}
