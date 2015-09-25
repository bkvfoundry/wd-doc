# md-doc

An opinionated documentation file manager API.

The goals of md-doc are:

1. Write documentation with markdown.
2. Support external tools to interact and rely on md-docs.

Documentation can be organised in a Project by the following scopes:

- Project
- Directory
- File

Markdown files that are managed by **md-docs** are stored at the root of project in `.mddocs/`.

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

## Usage

```js
'use strict';

let markdownDoc = require('md-doc');

let projectRootPath = './unicorns/';

// Starts a watcher for changes in a project
markdownDoc(projectRootPath, (mdd) => {
  console.log('Ready to do stuff!')

  /* Add doc files to the project */

  // Doc will be scoped to the project (alias for addDirDoc to project root dir)
  mdd.addProjectDoc('Project Setup', '# Title!\nContent', (docPath) => console.log(docPath));

  // Doc will be scoped to a directory within the project root
  mdd.addDirDoc('Project Setup', 'rainbows/', '# Title!\nContent', (docPath) => console.log(docPath));

  // Doc will be scoped to a file within the project root
  mdd.addFileDoc('Project Setup', 'rainbows/kittens.js', '# Title..\nContent..', (docPath) => console.log(docPath));

  /* Handle changes in md-doc */

  mdd.on('ready', () => console.log('all the doc files are now being watched :)'));
  mdd.on('added', (filePath) => console.log(filepath));
  mdd.on('changed', (filePath) => console.log(filepath));
  mdd.on('deleted', (filePath) => console.log(filepath));
  mdd.on('end', () => console.log('all the doc files are not being watched :('));
});
```

## Install

```sh
$ npm install --save md-doc
```

## License

MIT © [BKVFoundry](https://github.com/BKVFoundry)

# Contributors

- [Lochlan Bunn](https://github.com/loklaan) (author)


[npm-image]: https://badge.fury.io/js/md-doc.svg
[npm-url]: https://npmjs.org/package/md-doc
[travis-image]: https://travis-ci.org/BKVFoundry/md-doc.svg?branch=master
[travis-url]: https://travis-ci.org/BKVFoundry/md-doc
[daviddm-image]: https://david-dm.org/BKVFoundry/md-doc.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/BKVFoundry/md-doc
[coveralls-image]: https://coveralls.io/repos/BKVFoundry/md-doc/badge.svg
[coveralls-url]: https://coveralls.io/r/BKVFoundry/md-doc
