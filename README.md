
# dist-size

[![NPM version](https://img.shields.io/npm/v/dist-size.svg?style=flat)](https://npmjs.com/package/dist-size) [![NPM downloads](https://img.shields.io/npm/dm/dist-size.svg?style=flat)](https://npmjs.com/package/dist-size) [![CircleCI](https://circleci.com/gh/egoist/dist-size/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/dist-size/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

<img src="https://i.loli.net/2017/08/06/5986a6715e3ce.png" alt="preview" width="500">

## Install

```bash
yarn global add dist-size
# or
npm i -g dist-size
```

## Usage

```bash
# print file sizes for `./dist` folder
dist-size

# or anywhere
dist-size ./path/to/folder

# or custom extensions
dist-size -e ts
# defaults to `js,css`
```

## API

```js
const distSize = require('dist-size')

distSize({
  baseDir,
  extensions
}).then(res => {
  for (const file of res) {
    console.log(file)
    //=>
    {
      name,
      path,
      size,
      gzip
    }
  }
})
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**dist-size** © [EGOIST](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/dist-size/contributors)).

> [github.com/egoist](https://github.com/egoist) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
