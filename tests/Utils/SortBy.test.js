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
    sortBy = loader('Entity/Utils/SortBy');

describe('entity/Utils/SortBy', function () {

  'use strict';

  describe('SortBy([Array])', function () {

    it('shouldSortByWeight', function () {

      var data = [{
            text: 'world',
            weight: 1
          }, {
            text: 'hello'
          }];

      sortBy(data, 'weight');
      test.array(data).is([{
        text: 'hello'
      }, {
        text: 'world',
        weight: 1
      }]);

    });

    it('shouldSortUsingWeightFunction', function () {

      var weightFnc = function () {
            return 1;
          },
          weightFnc2 = function () {
            return -1;
          },
          data = [{
            text: 'world',
            weight: weightFnc
          }, {
            text: 'hello'
          }, {
            text: 'foo',
            weight: weightFnc2
          }];

      sortBy(data, 'weight');
      test.array(data).is([{
        text: 'foo',
        weight: weightFnc2
      }, {
        text: 'hello'
      }, {
        text: 'world',
        weight: weightFnc
      }]);

    });

    it('shouldSortInReverese', function () {

      var data = [{
            text: 'world'
          }, {
            text: 'hello',
            weight: 1
          }, {
            text: 'foo',
            weight: -1
          }, {
            text: 'bar',
            weight: 100
          }];

      sortBy(data, 'weight', true);
      test.array(data).is([{
        text: 'bar',
        weight: 100
      }, {
        text: 'foo',
        weight: -1
      }, {
        text: 'hello',
        weight: 1
      }, {
        text: 'world'
      }]);

    });

  });

  describe('SortBy([Object])', function () {

    it('shouldSortByWeight', function () {

      var data = {
            world: 'world',
            hello: {weight: -1},
            foo: {weight: 1}
          };

      sortBy(data, 'weight');
      test.object(data).is({
        hello: {weight: -1},
        world: 'world',
        foo: {weight: 1}
      });

    });

    it('shouldSortIgnoresFunctions', function () {

      var fnc = function () {},
          data = {
            world: 'world',
            hello: {weight: -1},
            foo: 'bar',
            func: fnc,
            bar: {weight: 1}
          };

      sortBy(data, 'weight');
      test.object(data).is({
        func: fnc,
        hello: {weight: -1},
        world: 'world',
        foo: 'bar',
        bar: {weight: 1}
      });

    });

    it('shouldSortUsingWeightFunction', function () {

      var weightFnc = function () {
            return -1;
          },
          weightFnc2 = function () {
            return 1;
          },
          data = {
            world: 'world',
            hello: {weight: weightFnc},
            foo: {weight: weightFnc2}
          };

      sortBy(data, 'weight');
      test.object(data).is({
        hello: {weight: weightFnc},
        world: 'world',
        foo: {weight: weightFnc2}
      });

    });

    it('shouldSortInReverese', function () {

      var data = {
            hello: {weight: -1},
            world: 'world',
            foo: {weight: 1}
          };

      sortBy(data, 'weight', true);
      test.object(data).is({
        foo: {weight: 1},
        world: 'world',
        hello: {weight: -1}
      });

    });

  });

});
