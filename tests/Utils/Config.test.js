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
    Config = loader('Entity/Utils/Config');

describe('entity/Utils/Config', function () {

  'use strict';

  var tmpPath = path.join(
        os.tmpdir(), 'entity-tests--config--' + process.pid
      );

  describe('Config.has()', function () {

    it('hasShouldReturnFalseIfPropertyDoesntExist', function () {

      var config = new Config();

      test.bool(
        config.has('test')
      ).isNotTrue();

    });

    it('hasShouldFindTheFirstLevelPropertyOfSingleLevel', function () {

      var config = new Config();
      config.data.test = 'hello';

      test.bool(
        config.has('test')
      ).isTrue();

    });

    it('hasShouldFindTheFirstLevelPropertyOfMultiLevel', function () {

      var config = new Config();
      config.data.test = {value: 'hello'};

      test.bool(
        config.has('test')
      ).isTrue();

    });

    it('hasShouldFindTheSecondLevelPropertyOfMultiLevel', function () {

      var config = new Config();
      config.data.test = {value: 'hello'};

      test.bool(
        config.has('test.value')
      ).isTrue();

    });

  });

  describe('Config.get()', function () {

    it('getWillReturnNullIfItDoesntExist', function () {

      var config = new Config();

      test.value(
        config.get('test')
      ).isNull();

    });

    it('getWillReturnTheDefaultValueIfItDoesntExist', function () {

      var config = new Config();

      test.bool(
        config.get('test', false)
      ).isNotTrue();

    });

    it('getTheFirstLevelPropertyOfSingleLevel', function () {

      var config = new Config();
      config.data.test = 'value';

      test.string(
        config.get('test')
      ).is('value');

    });

    it('getTheFirstLevelPropertyOfMultiLevel', function () {

      var config = new Config();
      config.data.test = {value: 'hello'};

      test.object(
        config.get('test')
      ).is({value: 'hello'});

    });

    it('getTheSecondLevelPropertyOfMultiLevel', function () {

      var config = new Config();
      config.data.test = {value: 'hello'};

      test.string(
        config.get('test.value')
      ).is('hello');

    });

  });

  describe('Config.set()', function () {

    it('setValue', function () {

      var config = new Config();

      config.set('test', 'hello');
      test.object(
        config.data
      ).is({
        test: 'hello'
      });

    });

    it('setMultiLevelValue', function () {

      var config = new Config();

      config.set('test.value', 'hello');
      test.object(
        config.data
      ).is({
        test: {
          value: 'hello'
        }
      });

    });

  });

  describe('Config.del()', function () {

    it('delValue', function () {

      var config = new Config();
      config.data.test = 'hello';

      config.del('test');
      test.object(
        config.data
      ).is({});

    });

    it('delAMultiValue', function () {

      var config = new Config();
      config.data.test = {value: 'hello'};

      config.del('test');
      test.object(
        config.data
      ).is({});

    });

    it('delAMultiValueValue', function () {

      var config = new Config();
      config.data.test = {value: 'hello'};

      config.del('test.value');
      test.object(
        config.data
      ).is({
        test: {}
      });

    });

  });

  describe('Config.save()', function () {

    beforeEach(function () {

      fs.mkdirSync(tmpPath);

    });

    afterEach(function () {

      if (fs.existsSync(path.join(tmpPath, 'config.json'))) {
        fs.unlinkSync(path.join(tmpPath, 'config.json'));
      }

      fs.rmdirSync(path.join(tmpPath));

    });

    it('savesAnEmptyConfigFile', function (done) {

      var config = new Config(null, path.join(tmpPath, 'config.json'));

      config.save(function (err) {

        test.value(err).isNull();
        test.bool(
          fs.existsSync(config.filename)
        ).isTrue();

        done();

      });

    });

    it('savesPopulatedConfig', function (done) {

      var config = new Config(null, path.join(tmpPath, 'config.json'));
      config.data.test = {value: 'hello'};

      config.save(function (err) {

        test.value(err).isNull();

        test.object(
          JSON.parse(
            fs.readFileSync(config.filename)
          )
        ).is(config.data);

        done();

      });

    });

    it('throwsAnErrorIfUnableToSave', function (done) {

      var config = new Config(null, path.join('/etc', 'config.json'));

      config.save(function (err) {

        test.value(
          err
        ).isInstanceOf(Error);

        done();

      });

    });

  });

  describe('Config.load()', function () {

    beforeEach(function () {

      fs.mkdirSync(tmpPath);
      fs.writeFileSync(path.join(tmpPath, 'config.json'), JSON.stringify({
        test: {value: 'hello'}
      }));

    });

    afterEach(function () {

      fs.unlinkSync(path.join(tmpPath, 'config.json'));
      fs.rmdirSync(path.join(tmpPath));

    });

    it('errorIsThrownIfTheConfigDoesntExist', function (done) {

      var config = new Config(null, path.join(tmpPath, 'config2.json'));

      config.load(function (err) {

        test.error(
          err
        ).isInstanceOf(Error);

        done();

      });

    });

    it('loadFromConfigFile', function (done) {

      var config = new Config(null, path.join(tmpPath, 'config.json'));

      config.load(function (err) {

        test.value(err).isNull();

        test.object(
          config.data
        ).is({
          test: {value: 'hello'}
        });

        done();

      });

    });

    it('loadFromConfigFileResetsExistingConfig', function (done) {

      var config = new Config(null, path.join(tmpPath, 'config.json'));
      config.data.hello = 'world';

      config.load(function (err) {

        test.value(err).isNull();
        test.object(
          config.data
        ).is({
          test: {value: 'hello'}
        });

        done();

      });

    });

    it('throwsAnErrorIfTheConfigFileIsNotValidJSON', function (done) {

      fs.writeFileSync(path.join(tmpPath, 'config.json'), 'test');

      var config = new Config(null, path.join(tmpPath, 'config.json'));

      config.load(function (err) {

        test.value(
          err
        ).isInstanceOf(Error);

        done();

      });

    });

  });

});
