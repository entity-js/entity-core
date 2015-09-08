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
    async = require('async'),
    test = require('unit.js'),
    loader = require('nsloader'),
    PluginManager = loader('Entity/PluginManager'),
    Plugin = loader('Entity/PluginManager/Plugin'),
    EUnknownPlugin = loader('Entity/PluginManager/Errors/EUnknownPlugin'),
    EPluginEnabled = loader('Entity/PluginManager/Errors/EPluginEnabled'),
    EPluginDisabled = loader('Entity/PluginManager/Errors/EPluginDisabled'),
    EPluginUnmetDependencies = loader(
      'Entity/PluginManager/Errors/EPluginUnmetDependencies'
    );

describe('entity/PluginManager', function () {

  'use strict';

  var tmpPath = path.join(
        __dirname, 'entity-tests--plugins--' + process.pid
      );

  beforeEach(function () {

    fs.mkdirSync(tmpPath);

    var weights = [10, -10, 0, 40],
        deps = [[], [], ['plugin2'], ['plugin1', 'plugin5']];

    for (var i = 1; i <= 4; i++) {
      fs.mkdirSync(path.join(tmpPath, 'plugin' + i));
      fs.writeFileSync(
        path.join(tmpPath, 'plugin' + i, 'plugin.json'),
        JSON.stringify({
          title: 'Plugin ' + i,
          description: 'Plugin example ' + i + '.',
          weight: weights[i - 1],
          dependencies: deps[i - 1]
        })
      );

      fs.writeFileSync(path.join(tmpPath, 'plugin' + i, 'index.js'), '\n\
        var loader = require(\'nsloader\');\n\
        var Plugin = loader(\'Entity/PluginManager/Plugin\');\n\
        \n\
        module.exports = class Plugin' + i + ' extends Plugin {};\n\
      ');
    }

  });

  afterEach(function () {

    for (var i = 1; i <= 4; i++) {
      fs.unlinkSync(path.join(tmpPath, 'plugin' + i, 'plugin.json'));
      fs.unlinkSync(path.join(tmpPath, 'plugin' + i, 'index.js'));
      fs.rmdirSync(path.join(tmpPath, 'plugin' + i));
    }

    fs.rmdirSync(tmpPath);
  });

  describe('PluginManager.index()', function () {

    it('shouldIndexPlugins', function (done) {

      var pluginManager = new PluginManager();
      pluginManager.index(tmpPath, function (err) {

        test.array(
          pluginManager.plugins
        ).is(['plugin1', 'plugin2', 'plugin3', 'plugin4']);

        done();

      });

    });

  });

  describe('PluginManager.dependencies()', function () {

    it('shouldReturnDepedenciesInfo', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        test.object(
          pluginManager.dependencies('plugin1')
        ).is({
          plugins: [],
          unmet: [],
          can: true
        });

        next();

      });

      async.series(queue, done);

    });

    it('shouldReturnDepedenciesInfoWithDependants', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        test.object(
          pluginManager.dependencies('plugin4')
        ).is({
          plugins: ['plugin1', 'plugin5'],
          unmet: ['plugin5'],
          can: false
        });

        next();

      });

      async.series(queue, done);

    });

  });

  describe('PluginManager.enable()', function () {

    it('shouldThrowAnErrorIfDoesntExist', function (done) {

      var pluginManager = new PluginManager();
      pluginManager.enable('plugin1', function (err) {

        test.object(
          err
        ).isInstanceOf(EUnknownPlugin);

        done();

      });

    });

    it('shouldEnableThePlugin', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        test.array(
          pluginManager.enabled
        ).is([]);

        next();

      });

      queue.push(function (next) {

        pluginManager.enable('plugin1', next);

      });

      queue.push(function (next) {

        test.array(
          pluginManager.enabled
        ).is(['plugin1']);

        next();

      });

      async.series(queue, done);

    });

    it('shouldThrowAnErrorIfAlreadyEnabled', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.enable('plugin1', next);

      });

      queue.push(function (next) {

        pluginManager.enable('plugin1', function (err) {

          test.object(
            err
          ).isInstanceOf(EPluginEnabled);

          next();

        });

      });

      async.series(queue, done);

    });

    it('shouldThrowAnErrorIfPluginHasUnmetDependencies', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.enable('plugin4', function (err) {

          test.object(
            err
          ).isInstanceOf(EPluginUnmetDependencies);

          next();

        });

      });

      async.series(queue, done);

    });

    it('shouldEnableMetDependencies', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.enable('plugin3', function (err) {

          test.value(
            err
          ).isNull();

          test.array(
            pluginManager.enabled
          ).is(['plugin2', 'plugin3']);

          next();

        });

      });

      async.series(queue, done);

    });

  });

  describe('PluginManager.initialize()', function () {

    it('shouldInitializeTheProvidedPlugins', function (done) {

      var pluginManager = new PluginManager();
      pluginManager.index(tmpPath, function (err) {

        test.array(
          pluginManager.enabled
        ).is([]);

        pluginManager.initialize(['plugin1'], function (err) {

          test.value(
            err
          ).isNull();

          test.array(
            pluginManager.enabled
          ).is(['plugin1']);

          done();

        });

      });

    });

  });

  describe('PluginManager.plugin()', function () {

    it('shouldReturnNullIfPluginDoesntExist', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.initialize([], next);

      });

      queue.push(function (next) {

        test.value(
          pluginManager.plugin('plugin1')
        ).isNull();

        next();

      });

      async.series(queue, done);

    });

    it('shouldReturnThePluginObject', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.initialize(['plugin1'], next);

      });

      queue.push(function (next) {

        test.object(
          pluginManager.plugin('plugin1')
        ).isInstanceOf(Plugin).hasKey('name', 'plugin1');

        next();

      });

      async.series(queue, done);

    });

  });

  describe('PluginManager.isEnabled()', function () {

    it('shouldReturnFalseIfNotEnabled', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        test.bool(
          pluginManager.isEnabled('plugin1')
        ).isNotTrue();

        next();

      });

      async.series(queue, done);

    });

    it('shouldReturnTrueIfEnabled', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.enable('plugin1', next);

      });

      queue.push(function (next) {

        test.bool(
          pluginManager.isEnabled('plugin1')
        ).isTrue();

        next();

      });

      async.series(queue, done);

    });

  });

  describe('PluginManager.disable()', function () {

    it('shouldThrowAnErrorIfDoesntExist', function (done) {

      var pluginManager = new PluginManager();
      pluginManager.disable('plugin1', function (err) {

        test.object(
          err
        ).isInstanceOf(EUnknownPlugin);

        done();

      });

    });

    it('shouldDisableThePlugin', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.enable('plugin1', next);

      });

      queue.push(function (next) {

        test.array(
          pluginManager.enabled
        ).is(['plugin1']);

        next();

      });

      queue.push(function (next) {

        pluginManager.disable('plugin1', next);

      });

      queue.push(function (next) {

        test.array(
          pluginManager.enabled
        ).is([]);

        next();

      });

      async.series(queue, done);

    });

    it('shouldThrowAnErrorIfAlreadyDisabled', function (done) {

      var queue = [],
          pluginManager = new PluginManager();

      queue.push(function (next) {

        pluginManager.index(tmpPath, next);

      });

      queue.push(function (next) {

        pluginManager.disable('plugin1', function (err) {

          test.object(
            err
          ).isInstanceOf(EPluginDisabled);

          next();

        });

      });

      async.series(queue, done);

    });

  });

});
