/**
 *  ____            __        __
 * /\  _`\         /\ \__  __/\ \__
 * \ \ \L\_\    ___\ \ ,_\/\_\ \ ,_\  __  __
 *  \ \  _\L  /' _ `\ \ \/\/\ \ \ \/ /\ \/\ \
 *   \ \ \L\ \/\ \/\ \ \ \_\ \ \ \ \_\ \ \_\ \
 *    \ \____/\ \_\ \_\ \__\\ \_\ \__\\/`____ \
 *     \/___/  \/_/\/_/\/__/ \/_/\/__/ `/___/> \
 *                                        /\___/
 *                                        \/__/
 *
 * Entity Core
 */

var path = require('path'),
    fs = require('fs'),
    os = require('os'),
    test = require('unit.js'),
    loader = require('nsloader'),
    EntityCore = loader('Entity/index');

describe('entity/EntityCore', function () {

  'use strict';

  var tmpPath = path.join(
        os.tmpdir(), 'entity-tests--config--' + process.pid
      ),
      cfgFilename = path.join(tmpPath, 'config.json'),
      cfgData = {
        test: {value: 'hello'}
      };

  beforeEach(function () {

    fs.mkdirSync(tmpPath);
    fs.writeFileSync(cfgFilename, JSON.stringify(cfgData));

  });

  afterEach(function () {

      fs.unlinkSync(cfgFilename);
      fs.rmdirSync(tmpPath);

    });

  describe('EntityCore.initialize()', function () {

    it('shouldInitializeWithoutIssues', function (done) {

      var entityCore = new EntityCore(cfgFilename);

      test.bool(
        entityCore.isInitialized
      ).isNotTrue();

      entityCore.initialize(function (err) {

        test.value(
          err
        ).isNull();

        test.bool(
          entityCore.isInitialized
        ).isTrue();

        done();

      });

    });

  });

});
