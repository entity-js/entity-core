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
    EntityCore = loader('Entity/index'),
    Config = loader('Entity/Utils/Config');

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

  describe('EntityCore.loadConfig()', function () {

    it('shouldThrowAnErrorIfConfigDoesntExist', function (done) {

      var entityCore = new EntityCore();

      entityCore._loadConfig(cfgFilename, function (err) {

        test.error(
          err
        ).isInstanceOf(Error);

        done();

      });

    });

    it('shouldLoadConfig', function (done) {

      var entityCore = new EntityCore();

      entityCore._loadConfig(cfgFilename, function (err) {

        test.value(
          err
        ).isNull();

        test.object(
          entityCore.config
        ).isInstanceOf(Config);

        test.object(
          entityCore.config.data
        ).is(cfgData);

        done();

      });

    });

  });

  describe('EntityCore.initialize()', function () {

    it('shouldInitializeWithoutIssues', function (done) {

      var entityCore = new EntityCore();

      test.bool(
        entityCore.initialized
      ).isNotTrue();

      entityCore.initialize(cfgFilename, function (err) {

        test.value(
          err
        ).isNull();

        test.bool(
          entityCore.initialized
        ).isTrue();

        done();

      });

    });

  });

  describe('EntityCore.config', function () {

    it('shouldReturnNullBeforeInitialize', function () {

      var entityCore = new EntityCore();

      test.value(
        entityCore.config
      ).isNull();

    });

    it('shouldInitializeWithoutIssues', function (done) {

      var entityCore = new EntityCore();

      entityCore.initialize('', function (err) {

        test.object(
          entityCore.config
        ).isInstanceOf(Config);

        done();

      });

    });

  });

});
