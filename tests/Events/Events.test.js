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

require('entity-core');

var test = require('unit.js'),
    loader = require('nsloader'),
    Events = loader('Entity/Events'),
    Event = loader('Entity/Events/Event');

describe('entity/Events', function () {

  'use strict';

  describe('Events.before()', function () {

    it('shouldRegisterAnEvent', function () {

      var events = new Events(),
          callback = function () {};

      test.object(
        events._events
      ).is({});

      events.before('test', callback);

      test.object(
        events._events
      ).hasKey('test');

      test.object(
        events.events
      ).is(['test']);

      test.object(
        events._events.test
      ).isInstanceOf(Event);

      test.array(
        events._events.test._before
      ).is([{
        callback: callback,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._on
      ).is([]);

      test.array(
        events._events.test._after
      ).is([]);

    });

    it('shouldBeSortedByWeight', function () {

      var events = new Events(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      events
        .before('test', callback1, 10)
        .before('test', callback2)
        .before('test', callback3, -10);

      test.object(
        events._events.test._before[0]
      ).is({
        callback: callback3,
        scope: null,
        weight: -10
      });

      test.object(
        events._events.test._before[1]
      ).is({
        callback: callback2,
        scope: null,
        weight: 0
      });

      test.object(
        events._events.test._before[2]
      ).is({
        callback: callback1,
        scope: null,
        weight: 10
      });

    });

  });

  describe('Events.on()', function () {

    it('shouldRegisterAnEvent', function () {

      var events = new Events(),
          callback = function () {};

      test.object(
        events._events
      ).is({});

      events.on('test', callback);

      test.object(
        events._events
      ).hasKey('test');

      test.object(
        events.events
      ).is(['test']);

      test.object(
        events._events.test
      ).isInstanceOf(Event);

      test.array(
        events._events.test._before
      ).is([]);

      test.array(
        events._events.test._on
      ).is([{
        callback: callback,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._after
      ).is([]);

    });

    it('shouldBeSortedByWeight', function () {

      var events = new Events(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      events
        .on('test', callback1, 10)
        .on('test', callback2)
        .on('test', callback3, -10);

      test.object(
        events._events.test._on[0]
      ).is({
        callback: callback3,
        scope: null,
        weight: -10
      });

      test.object(
        events._events.test._on[1]
      ).is({
        callback: callback2,
        scope: null,
        weight: 0
      });

      test.object(
        events._events.test._on[2]
      ).is({
        callback: callback1,
        scope: null,
        weight: 10
      });

    });

  });

  describe('Events.after()', function () {

    it('shouldRegisterAnEvent', function () {

      var events = new Events(),
          callback = function () {};

      test.object(
        events._events
      ).is({});

      events.after('test', callback);

      test.object(
        events._events
      ).hasKey('test');

      test.object(
        events.events
      ).is(['test']);

      test.object(
        events._events.test
      ).isInstanceOf(Event);

      test.array(
        events._events.test._before
      ).is([]);

      test.array(
        events._events.test._on
      ).is([]);

      test.array(
        events._events.test._after
      ).is([{
        callback: callback,
        scope: null,
        weight: 0
      }]);

    });

    it('shouldBeSortedByWeight', function () {

      var events = new Events(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      events
        .after('test', callback1, 10)
        .after('test', callback2)
        .after('test', callback3, -10);

      test.object(
        events._events.test._after[0]
      ).is({
        callback: callback3,
        scope: null,
        weight: -10
      });

      test.object(
        events._events.test._after[1]
      ).is({
        callback: callback2,
        scope: null,
        weight: 0
      });

      test.object(
        events._events.test._after[2]
      ).is({
        callback: callback1,
        scope: null,
        weight: 10
      });

    });

  });

  describe('Events.un()', function () {

    it('shouldUnregisterCallbackFromBeforeGroup', function () {

      var events = new Events(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      events
        .before('test', callback1)
        .before('test', callback2)
        .on('test', callback2)
        .after('test', callback3);

      events.un('test', callback1);

      test.array(
        events._events.test._before
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._on
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._after
      ).is([{
        callback: callback3,
        scope: null,
        weight: 0
      }]);

    });

    it('shouldUnregisterCallbackFromOnGroup', function () {

      var events = new Events(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      events
        .before('test', callback2)
        .on('test', callback1)
        .on('test', callback2)
        .after('test', callback3);

      events.un('test', callback1);

      test.array(
        events._events.test._before
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._on
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._after
      ).is([{
        callback: callback3,
        scope: null,
        weight: 0
      }]);

    });

    it('shouldUnregisterCallbackFromAfterGroup', function () {

      var events = new Events(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      events
        .before('test', callback2)
        .on('test', callback2)
        .after('test', callback1)
        .after('test', callback3);

      events.un('test', callback1);

      test.array(
        events._events.test._before
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._on
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._after
      ).is([{
        callback: callback3,
        scope: null,
        weight: 0
      }]);

    });

    it('shouldUnregisterCallbackFromAllGroups', function () {

      var events = new Events(),
          callback1 = function () {},
          callback2 = function () {};

      events
        .before('test', callback1)
        .before('test', callback2)
        .on('test', callback1)
        .on('test', callback2)
        .after('test', callback1)
        .after('test', callback2);

      events.un('test', callback1);

      test.array(
        events._events.test._before
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._on
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

      test.array(
        events._events.test._after
      ).is([{
        callback: callback2,
        scope: null,
        weight: 0
      }]);

    });

    it('shouldUnregisterCallbackFromAllGroupsAndEventIfEmpty', function () {

      var events = new Events(),
          callback = function () {};

      events
        .before('test', callback)
        .on('test', callback)
        .after('test', callback);

      events.un('test', callback);

      test.object(
        events._events
      ).notHasKey('test');

    });

    it('shouldUnregisterEvent', function () {

      var events = new Events(),
          callback = function () {};

      events
        .before('test', callback)
        .on('test', callback)
        .after('test', callback);

      events.un('test');

      test.object(
        events._events
      ).notHasKey('test');

    });

  });

  describe('Events.fire()', function () {

    it('shouldContinueWhenEventHasntBeenRegistered', function (done) {

      var events = new Events();

      events.fire(function (err, args) {

        test.value(
          err
        ).isNull();

        done();

      }, 'test');

    });

    it('shouldFireBeforeCallbacks', function (done) {

      var events = new Events(),
          called = null,
          callback = function (next, args) {
            called = args.msg;
            args.something = 'Foo bar';

            next();
          };

      events.before('test', callback);

      events.fire(function (err, args) {

        test.value(
          err
        ).isNull();

        test.object(
          args
        ).is({
          msg: 'Hello world',
          something: 'Foo bar'
        });

        test.string(
          called
        ).is('Hello world');

        done();

      }, 'test', {
        msg: 'Hello world'
      });

    });

    it('shouldFireOnCallbacks', function (done) {

      var events = new Events(),
          called = null,
          callback = function (next, args) {
            called = args.msg;
            args.something = 'Foo bar';

            next();
          };

      events.on('test', callback);

      events.fire(function (err, args) {

        test.value(
          err
        ).isNull();

        test.object(
          args
        ).is({
          msg: 'Hello world',
          something: 'Foo bar'
        });

        test.string(
          called
        ).is('Hello world');

        done();

      }, 'test', {
        msg: 'Hello world'
      });

    });

    it('shouldFireAfterCallbacks', function (done) {

      var events = new Events(),
          called = null,
          callback = function (next, args) {
            called = args.msg;
            args.something = 'Foo bar';

            next();
          };

      events.after('test', callback);

      events.fire(function (err, args) {

        test.value(
          err
        ).isNull();

        test.object(
          args
        ).is({
          msg: 'Hello world',
          something: 'Foo bar'
        });

        test.string(
          called
        ).is('Hello world');

        done();

      }, 'test', {
        msg: 'Hello world'
      });

    });

    it('shouldFireAllEventCallbacks', function (done) {

      var events = new Events(),
          called = '',
          callback1 = function (next, args) {
            called += args.before;
            next();
          },
          callback2 = function (next, args) {
            called += args.on;
            next();
          },
          callback3 = function (next, args) {
            called += args.after;
            next();
          };

      events
        .before('test', callback1)
        .on('test', callback2)
        .after('test', callback3);

      events.fire(function (err, args) {

        test.value(
          err
        ).isNull();

        test.object(
          args
        ).is({
          before: 'Hello',
          on: ' ',
          after: 'world'
        });

        test.string(
          called
        ).is('Hello world');

        done();

      }, 'test', {
        before: 'Hello',
        on: ' ',
        after: 'world'
      });

    });

    it('shouldFireMultipleEvents', function (done) {

      var events = new Events(),
          called = '',
          callback1 = function (next, args) {
            called += args.before;
            next();
          },
          callback2 = function (next, args) {
            called += args.on;
            next();
          },
          callback3 = function (next, args) {
            called += args.after;
            next();
          },
          callback4 = function (next, args) {
            called += ' :)';
            next();
          };

      events
        .before('test', callback1)
        .on('test', callback2)
        .on('test2', callback3)
        .after('test2', callback4);

      events.fire(function (err, args) {

        test.value(
          err
        ).isNull();

        test.object(
          args
        ).is({
          before: 'Hello',
          on: ' ',
          after: 'world'
        });

        test.string(
          called
        ).is('Hello world :)');

        done();

      }, ['test', 'test2'], {
        before: 'Hello',
        on: ' ',
        after: 'world'
      });

    });

    it('shouldFireMultipleEventsInOrder', function (done) {

      var events = new Events(),
          called = '',
          callback1 = function (next, args) {
            called += args.before;
            next();
          },
          callback2 = function (next, args) {
            called += args.on;
            next();
          },
          callback3 = function (next, args) {
            called += args.after;
            next();
          },
          callback4 = function (next, args) {
            called += ' :)';
            next();
          };

      events
        .before('test', callback1)
        .on('test', callback2)
        .on('test2', callback3)
        .after('test2', callback4);

      events.fire(function (err, args) {

        test.value(
          err
        ).isNull();

        test.object(
          args
        ).is({
          before: ' ',
          on: 'world',
          after: 'Hello'
        });

        test.string(
          called
        ).is('Hello :) world');

        done();

      }, ['test2', 'test'], {
        before: ' ',
        on: 'world',
        after: 'Hello'
      });

    });

    it('shouldCatchErrors', function (done) {

      var events = new Events(),
          called1 = false,
          called2 = false,
          callback1 = function (next, args) {
            called1 = true;
            next(new Error());
          },
          callback2 = function (next, args) {
            called2 = true;
            next();
          };

      events
        .on('test', callback1)
        .on('test', callback2);

      events.fire(function (err, args) {

        test.object(
          err
        ).isInstanceOf(Error);

        test.bool(
          called1
        ).isTrue();

        test.bool(
          called2
        ).isNotTrue();

        done();

      }, 'test', {
        msg: 'Hello world'
      });

    });

    it('shouldCatchUncaughtErrors', function (done) {

      var events = new Events(),
          called1 = false,
          called2 = false,
          callback1 = function (next, args) {
            called1 = true;
            should.throw.an.error = true;
            next();
          },
          callback2 = function (next, args) {
            called2 = true;
            next();
          };

      events
        .on('test', callback1)
        .on('test', callback2);

      events.fire(function (err, args) {

        test.object(
          err
        ).isInstanceOf(Error);

        test.bool(
          called1
        ).isTrue();

        test.bool(
          called2
        ).isNotTrue();

        done();

      }, 'test', {
        msg: 'Hello world'
      });

    });

  });

});
