const path = require('path')
const globby = require('globby')
const pify = require('pify')
const gzipSize = pify(require('gzip-size'))
// eslint-disable-next-line import/order
const fs = pify(require('fs'))

module.exports = function ({
  baseDir = 'dist',
  extensions = ['js', 'css']
} = {}) {
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
  const res = {}
  return globby([`**/*.${extensions}`, '!**/node_modules/**'], {
    cwd: baseDir,
    nodir: true,
    statCache })
    .then(() => {
      return Promise.all(Object.keys(statCache).map(filepath => {
        const stat = statCache[filepath]
        return fs.readFile(filepath, 'utf8')
          .then(str => gzipSize(str))
          .then(size => {
            const name = path.relative(baseDir, filepath)
            res[filepath] = {
              name,
              size: stat.size,
              gzip: size
            }
          })
      }))
    })
    .then(() => res)
}
