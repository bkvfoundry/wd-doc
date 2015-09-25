import fse from 'fs-extra';
import path from 'path';
import debugging from 'debug';
import intoStream from 'into-stream';
import sanitizeFileName from 'sanitize-filename';
import {Gaze} from 'gaze';
import {EventEmitter} from 'events';

let debug = {
  log: debugging('mddoc:log'),
  error: debugging('mddoc:error'),
  warning: debugging('mddoc:warning'),
  verb: debugging('mddoc:verb'),
  event: debugging('mddoc:event')
};

export class MarkdownDoc extends EventEmitter {
  constructor(projectRootPath, callback) {
    super();

    this.PROJECT_PATH = this._validateProjectPath(projectRootPath);
    this.MD_DOC_ROOT_NAME = '.mddocs/';
    this.MD_DOC_ROOT = path.resolve(this.PROJECT_PATH, this.MD_DOC_ROOT_NAME);
    this.MD_DOC_GLOB = path.resolve(path.join(this.MD_DOC_ROOT, './**/*.md'));

    this._setupDocRoot(() => {
      this._setupFileWatcher();
      callback(this);
    });
  }

  close() {
    if (this.gaze) {
      this.gaze.close();
    }
  }

  addProjectDoc(docName, docContent = '', cb) {
    this.addDirDoc(docName, this.PROJECT_PATH, docContent, cb);
  }

  addDirDoc(docName, dirPath, docContent = '', cb) {
    let info = path.parse(dirPath);
    let dirBaseName = path.resolve(info.dir) === this.PROJECT_PATH ? 'root' : path.basename(info.dir);
    let validatedDocName = sanitizeFileName(`${docName}__${dirBaseName}`);
    this._createDoc(validatedDocName, dirPath, docContent, cb);
  }

  addFileDoc(docName, filePath, docContent = '', cb) {
    let info = path.parse(filePath);
    let dirBaseName = path.resolve(info.dir) === this.PROJECT_PATH ? 'root' : path.basename(info.dir);
    let fileName = info.base;
    let validatedDocName = sanitizeFileName(`${docName}__${dirBaseName}__${fileName}`);
    this._createDoc(validatedDocName, filePath, docContent, cb);
  }

  getProjectDocs() {}
  getDirDocs() {}
  getFileDocs() {}

  _createDoc(name, dir, content = '', cb) {
    if (this._validatePath(dir)) {
      // We treat the project root as an absolute root for .md documents
      let internalProjectPath = path.isAbsolute(dir) ? path.join('./', dir.replace(this.PROJECT_PATH, '')) : dir;
      internalProjectPath = internalProjectPath.length > 0 ? internalProjectPath : './';

      let validatedDocName = sanitizeFileName(`${name}.md`);
      let docOutputPath = path.resolve(this.MD_DOC_ROOT, internalProjectPath, validatedDocName);
      let writeStream = fse.createOutputStream(docOutputPath);

      debug.log(`Attempting to create ${docOutputPath}...`);

      intoStream(content)
        .pipe(writeStream)
        .on('error', cb)
        .on('finish', () => {
          debug.log(`Success creating ${docOutputPath}`);
          cb(null, docOutputPath);
        });
    } else {
      cb(new Error('Given an invalid path. Please choose a valid path.'));
    }
  }

  _setupFileWatcher() {
    this.gaze = new Gaze(this.MD_DOC_GLOB);

    // On gaze ready/started
    this.gaze.on('ready', (watcher) => {
      this.emit('ready', watcher);
      debug.event('ready: started watching all files');
    });

    // On file changed
    this.gaze.on('changed', (filePath) => {
      this.emit('changed', filePath);
      debug.event(`changed: changed file ${filePath}`);
    });

    // On file added
    this.gaze.on('added', (filePath) => {
      this.emit('added', filePath);
      debug.event(`added: added file ${filePath}`);
    });

    // On file deleted
    this.gaze.on('deleted', (filePath) => {
      this.emit('deleted', filePath);
      debug.event(`deleted: deleted file ${filePath}`);
    });

    // When the watcher is closed and all the whatchers have been removed
    this.gaze.on('end', () => {
      this.emit('end');
      debug.event('end: removed all watchers from the file watcher');
    });

    // On changed/added/deleted
    this.gaze.on('all', (event, filePath) => {
      this.emit('all', event, filePath);
      debug.event(`all: ${filePath} was ${event}`);
    });
  }

  _setupDocRoot(cb) {
    fse.ensureDir(this.MD_DOC_ROOT, (err) => {
      if (err) {
        throw err;
      }
      cb();
    });
  }

  _validatePath(dirPath) {
    let isValidRelativePath = !path.isAbsolute(dirPath);
    let isValidAbsolutePath = path.isAbsolute(dirPath) && dirPath.indexOf(this.PROJECT_PATH) !== -1;

    return isValidRelativePath || isValidAbsolutePath;
  }

  _validateProjectPath(projectPath) {
    let absProjectPath = path.resolve(projectPath);
    let stats = fse.statSync(projectPath);
    if (!stats.isDirectory()) {
      throw new Error(`Provide a directory path. ${absProjectPath} is not a directory path.`);
    } else {
      return absProjectPath;
    }
  }
}

export default function constructor(projectRootPath, callback) {
  return new MarkdownDoc(projectRootPath, (mdd) => {
    callback(mdd);
  });
}
