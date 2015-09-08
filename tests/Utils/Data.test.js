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

var test = require('unit.js'),
    loader = require('nsloader'),
    Data = loader('Entity/Utils/Data');

describe('entity/Utils/Data', function () {

  'use strict';

  describe('Data.seperator', function () {

    it('shouldReturnTheDefaultSeperator', function () {

      var config = {},
          data = new Data(config);

      test.string(
        data.seperator
      ).is('.');

    });

    it('shouldReturnTheDefaultSeperator', function () {

      var config = {},
          data = new Data(config, '/');

      test.string(
        data.seperator
      ).is('/');

    });

  });

  describe('Data.has()', function () {

    it('hasShouldReturnFalseIfPropertyDoesntExist', function () {

      var config = {},
          data = new Data(config);

      test.bool(
        data.has('test')
      ).isNotTrue();

    });

    it('hasShouldFindTheFirstLevelPropertyOfSingleLevel', function () {

      var config = {'test': 'hello'},
          data = new Data(config);

      test.bool(
        data.has('test')
      ).isTrue();

    });

    it('hasShouldFindTheFirstLevelPropertyOfMultiLevel', function () {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      test.bool(
        data.has('test')
      ).isTrue();

    });

    it('hasShouldFindTheSecondLevelPropertyOfMultiLevel', function () {

      var config = {'test': {'value': 'hello'}},
          data =new Data(config);

      test.bool(
        data.has('test.value')
      ).isTrue();

    });

    it('hasShouldntFindDeepProperty', function () {

      var config = {},
          data = new Data(config);

      test.bool(
        data.has('test.hello.world.foo')
      ).isNotTrue();

    });

    it('hasShouldFindDeepProperty', function () {

      var config = {test: {hello: {world: {foo: 'bar'}}}},
          data = new Data(config);

      test.bool(
        data.has('test.hello.world.foo')
      ).isTrue();

    });

  });

  describe('Data.get()', function () {

    it('getWillReturnNullIfItDoesntExist', function () {

      var config = {},
          data = new Data(config);

      test.value(
        data.get('test')
      ).isNull();

    });

    it('getWillReturnTheDefaultValueIfItDoesntExist', function () {

      var config = {},
          data = new Data(config);

      test.bool(
        data.get('test', true)
      ).isTrue();

    });

    it('getTheFirstLevelPropertyOfSingleLevel', function () {

      var config = {'test': 'value'},
          data = new Data(config);

      test.string(
        data.get('test')
      ).is('value');

    });

    it('getTheFirstLevelPropertyOfMultiLevel', function () {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      test.object(
        data.get('test')
      ).is({'value': 'hello'});

    });

    it('getTheSecondLevelPropertyOfMultiLevel', function () {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      test.string(
        data.get('test.value')
      ).is('hello');

    });

    it('getUnknownDeepLevelValue', function () {

      var config = {},
          data = new Data(config);

      test.value(
        data.get('test.hello.world.foo')
      ).isNull();

    });

    it('getUnknownDeepLevelValue', function () {

      var config = {test: {hello: {world: {foo: 'bar'}}}},
          data = new Data(config);

      test.string(
        data.get('test.hello.world.foo')
      ).is('bar');

    });

  });

  describe('Data.set()', function () {

    it('setValue', function () {

      var config = {},
          data = new Data(config);

      data.set('test', 'hello');
      test.object(
        config
      ).is({
        'test': 'hello'
      });

    });

    it('setValueChaining', function () {

      var config = {},
          data = new Data(config);

      data
        .set('test', 'hello')
        .set('test2', 'world');

      test.object(
        config
      ).is({
        'test': 'hello',
        'test2': 'world'
      });

    });

    it('setMultiLevelValue', function () {

      var config = {},
          data = new Data(config);

      data.set('test.value', 'hello');
      test.object(
        config
      ).is({
        'test': {
          'value': 'hello'
        }
      });

    });

    it('setDeepLevelLevelValue', function () {

      var config = {},
          data = new Data(config);

      data.set('test.hello.world.foo', 'bar');
      test.object(
        config
      ).is({
        'test': {
          'hello': {
            'world': {
              'foo': 'bar'
            }
          }
        }
      });

    });

  });

  describe('Data.del()', function () {

    it('delValue', function () {

      var config = {'test': 'hello'},
          data = new Data(config);

      data.del('test');
      test.object(
        config
      ).is({});

    });

    it('delValueChaining', function () {

      var config = {'test': 'hello', 'test2': 'world'},
          data = new Data(config);

      data
        .del('test')
        .del('test2');

      test.object(
        config
      ).is({});

    });

    it('delMultiValue', function () {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      data.del('test');
      test.object(
        config
      ).is({});

    });

    it('delMultiValueValue', function () {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      data.del('test.value');
      test.object(
        config
      ).is({
        'test': {}
      });

    });

  });

});
