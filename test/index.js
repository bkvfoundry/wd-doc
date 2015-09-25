/*eslint-disable */
import assert from 'assert';
import markdownDoc from '../lib';
import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';

var testValidProjPath = 'test/testProj';
var testInvalidProjPath = 'test/testNope';

var tempMdd = null;

describe('MarkdownDoc', function () {
  context('constructor', function() {
    before(function(done) {
      fse.mkdir(testValidProjPath, done);
    });

    it("should have a constructor function", function (done) {
      assert.equal('function', typeof markdownDoc, 'we expect the markdownDoc to be a function');
      done();
    });

    it('should construct with a valid relative project path', function (done) {
      assert.doesNotThrow(function() {
        tempMdd = markdownDoc(testValidProjPath, function(mdd) {
          assert(mdd.PROJECT_PATH, 'expect new markdownDoc to have a PROJECT_PATH');
          done();
        });
      }, 'expect no exceptions when using a valid project path');
    });

    it('should blow up when constructing with an invalid relative project path', function () {
      assert.throws(function() {
        tempMdd = markdownDoc(testInvalidProjPath, function(mdd) {
          // this won't be reached!
        });
      }, 'expect exception when using an invalid project path');
    });

    it("should create a .mddocs directory in the project root on construction", function (done) {
      tempMdd = markdownDoc(testValidProjPath, function(mdd) {
        fse.stat(path.join(testValidProjPath, '.mddocs/'), function(err, stats) {
          assert(!err, 'expect no err');
          assert(stats.isDirectory(), 'expect stats to return true on isDirectory()');
          done();
        })
      });
    });

    it("should emit a ready event after valid construction", function (done) {
      tempMdd = markdownDoc(testValidProjPath, function(mdd) {
        mdd.on('ready', function(watcher) {
          assert(watcher, 'expect ready event to be emitted and return a watcher object');
          done();
        })
      });
    });

    after(function(done) {
      fse.remove(testValidProjPath, done);
    });

    afterEach(function () {
      if (tempMdd) {
        tempMdd.close();
        tempMdd = null;
      }
    });
  });

  describe("API", function () {
    context("addProjectDoc()", function () {
      before(function(done) {
        fse.mkdir(testValidProjPath, done);
      });

      it("should add a project doc with valid arguments", function (done) {
        tempMdd = markdownDoc(testValidProjPath, function(mdd) {
          mdd.addProjectDoc('CoolDoc1', '# TITLE', function(err, mdDoc) {
            assert(!err, 'expect no err');
            assert(mdDoc, 'expect the new md docs path to be returned');
            done();
          });
        });
      });

      after(function(done) {
        fse.remove(testValidProjPath, done);
      });

      afterEach(function () {
        if (tempMdd) {
          tempMdd.close();
          tempMdd = null;
        }
      });
    });

    context("addDirDoc()", function () {
      before(function(done) {
        fse.mkdir(testValidProjPath, done);
      });

      it("should add a directory doc with valid arguments (relative path)", function (done) {
        tempMdd = markdownDoc(testValidProjPath, function(mdd) {
          mdd.addDirDoc('CoolDoc1', './some/path/', '# TITLE', function(err, mdDoc) {
            assert(!err, 'expect no err');
            assert(mdDoc, 'expect the new md docs path to be returned');
            done();
          });
        });
      });

      it("should add a directory doc with valid arguments (absolute path)", function (done) {
        tempMdd = markdownDoc(testValidProjPath, function(mdd) {
          mdd.addDirDoc('CoolDoc2', path.resolve(testValidProjPath, 'some/path/'), '# TITLE', function(err, mdDoc) {
            assert(!err, 'expect no err');
            assert(mdDoc, 'expect the new md docs path to be returned');
            done();
          });
        });
      });

      after(function(done) {
        fse.remove(testValidProjPath, done);
      });

      afterEach(function () {
        if (tempMdd) {
          tempMdd.close();
          tempMdd = null;
        }
      });
    });

    context("addFileDoc()", function () {
      before(function(done) {
        fse.mkdir(testValidProjPath, done);
      });

      it("should add a file doc with valid arguments (relative path)", function (done) {
        tempMdd = markdownDoc(testValidProjPath, function(mdd) {
          mdd.addFileDoc('CoolDoc1', './some/path/kindaCoolCodez.js', '# TITLE', function(err, mdDoc) {
            assert(!err, 'expect no err');
            assert(mdDoc, 'expect the new md docs path to be returned');
            done();
          });
        });
      });

      it("should add a file doc with valid arguments (absolute path)", function (done) {
        // this.timeout(100000)
        tempMdd = markdownDoc(testValidProjPath, function(mdd) {
          mdd.addFileDoc('CoolDoc2', path.resolve(testValidProjPath, './some/path/kindaCoolCodez.js'), '# TITLE', function(err, mdDoc) {
            assert(!err, 'expect no err');
            assert(mdDoc, 'expect the new md docs path to be returned');
            done();
          });
        });
      });

      after(function(done) {
        fse.remove(testValidProjPath, done);
      });

      afterEach(function () {
        if (tempMdd) {
          tempMdd.close();
          tempMdd = null;
        }
      });
    });
  });


});
