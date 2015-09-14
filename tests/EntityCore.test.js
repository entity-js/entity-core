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

  describe('EntityCore.middleware()', function () {

    it('shouldAddMiddlewareItem', function () {

      var entityCore = new EntityCore(),
          sMiddleware = Symbol.for('EntityCore.middleware'),
          cb = function (core, next) {};

      test.array(
        entityCore[sMiddleware]
      ).hasLength(0);

      entityCore.middleware(cb);

      test.array(
        entityCore[sMiddleware]
      ).hasLength(1).is([{
        callback: cb,
        weight: 0
      }]);

    });

    it('shouldSortMiddlewareItems', function () {

      var entityCore = new EntityCore(),
          sMiddleware = Symbol.for('EntityCore.middleware'),
          cb1 = function (core, next) {},
          cb2 = function (core, next) {},
          cb3 = function (core, next) {};

      entityCore.middleware(cb1, 10);
      entityCore.middleware(cb2, -10);
      entityCore.middleware(cb3);

      test.object(
        entityCore[sMiddleware][0]
      ).is({
        callback: cb2,
        weight: -10
      });

      test.object(
        entityCore[sMiddleware][1]
      ).is({
        callback: cb3,
        weight: 0
      });

      test.object(
        entityCore[sMiddleware][2]
      ).is({
        callback: cb1,
        weight: 10
      });

    });

    it('shouldInitializeWithMiddleware', function (done) {

      var entityCore = new EntityCore(),
          called = [],
          cb1 = function (core, next) {
            called.push('cb1');
            next();
          },
          cb2 = function (core, next) {
            called.push('cb2');
            next();
          },
          cb3 = function (core, next) {
            called.push('cb3');
            next();
          };

      entityCore.middleware(cb1, 10);
      entityCore.middleware(cb2, -10);
      entityCore.middleware(cb3);

      entityCore._servers = function (done) {
        // Don't setup servers for testing.

        done();
      };

      entityCore.initialize(cfgFilename, function (err) {

        test.value(
          err
        ).isNull();

        test.bool(
          entityCore.initialized
        ).isTrue();

        test.array(
          called
        ).hasLength(3);

        test.string(
          called[0]
        ).is('cb2');

        test.string(
          called[1]
        ).is('cb3');

        test.string(
          called[2]
        ).is('cb1');

        done();

      });

    });

  });

});
