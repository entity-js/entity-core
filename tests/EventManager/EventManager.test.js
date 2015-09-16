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
    EventManager = loader('Entity/EventManager'),
    EUndefinedEvent = loader('Entity/EventManager/Errors/EUndefinedEvent');

describe('entity/EventManager', function () {

  'use strict';

  describe('EventManager.listen()', function () {

    it('shouldRegisterAnEventCallback', function () {

      var eventManager = new EventManager(),
          callback = function () {};

      eventManager.listen('test', callback);

      test.array(
        eventManager.events
      ).is(['test']);

    });

  });

  describe('EventManager.callbacks()', function () {

    it('shouldThrowAnErrorIfEventIsUndefined', function () {

      var eventManager = new EventManager();

      test.error(function () {
        eventManager.callbacks('test');
      })
        .isInstanceOf(EUndefinedEvent)
        .hasKey('eventName', 'test');

    });

    it('shouldReturnTheCallbacks', function () {

      var eventManager = new EventManager(),
          callback = function () {};

      eventManager.listen('test', callback);

      test.array(
        eventManager.callbacks('test')
      ).is([{
        callback: callback,
        scope: null,
        weight: 0
      }]);

    });

    it('shouldBeSortedByWeight', function () {

      var eventManager = new EventManager(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      eventManager.listen('test', callback1, null, 10);
      eventManager.listen('test', callback2);
      eventManager.listen('test', callback3, null, -10);

      var callbacks = eventManager.callbacks('test');
      test.object(
        callbacks[0]
      ).is({
        callback: callback3,
        scope: null,
        weight: -10
      });

      test.object(
        callbacks[1]
      ).is({
        callback: callback2,
        scope: null,
        weight: 0
      });

      test.object(
        callbacks[2]
      ).is({
        callback: callback1,
        scope: null,
        weight: 10
      });

    });

  });

  describe('EventManager.unlisten()', function () {

    it('shouldThrowAnErrorIfEventIsUndefined', function () {

      var eventManager = new EventManager();

      test.error(function () {
        eventManager.unlisten('test');
      })
        .isInstanceOf(EUndefinedEvent)
        .hasKey('eventName', 'test');

    });

    it('shouldRemoveTheSpecifiedCallback', function () {

      var eventManager = new EventManager(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      eventManager.listen('test', callback1);
      eventManager.listen('test', callback2);
      eventManager.listen('test', callback3);

      eventManager.unlisten('test', callback2);

      test.array(
        eventManager.callbacks('test')
      ).hasLength(2).is([{
        callback: callback1,
        scope: null,
        weight: 0
      }, {
        callback: callback3,
        scope: null,
        weight: 0
      }]);

    });

    it('shouldRemoveTheSpecifiedEvent', function () {

      var eventManager = new EventManager(),
          callback1 = function () {},
          callback2 = function () {},
          callback3 = function () {};

      eventManager.listen('test', callback1);
      eventManager.listen('test', callback2);
      eventManager.listen('test', callback3);

      eventManager.unlisten('test');

      test.array(
        eventManager.events
      ).hasLength(0).is([]);

      test.error(function () {
        eventManager.callbacks('test');
      }).isInstanceOf(Error);

    });

    it('shouldRemoveEventIfLastCallbackHasBeenRemoved', function () {

      var eventManager = new EventManager(),
          callback = function () {};

      eventManager.listen('test', callback);
      eventManager.unlisten('test', callback);

      test.array(
        eventManager.events
      ).hasLength(0).is([]);

      test.error(function () {
        eventManager.callbacks('test');
      }).isInstanceOf(Error);

    });

  });

  describe('EventManager.fire()', function () {

    it('shouldContinueAsExpectedWhenEventHasntBeenRegistered', function (done) {

      var eventManager = new EventManager();

      eventManager.fire('test', function (err) {

        test.value(
          err
        ).isNull();

        done();

      });

    });

    it('shouldFireTheCallbacks', function (done) {

      var eventManager = new EventManager(),
          callbacks = {},
          callback1 = function (next, params) {
            callbacks.callback1 = params.msg1;
            next();
          },
          callback2 = function (next, params) {
            callbacks.callback2 = params.msg2;
            next();
          };

      eventManager.listen('test', callback1);
      eventManager.listen('test', callback2);

      eventManager.fire('test', function (err) {

        test.value(
          err
        ).isNull();

        test.object(
          callbacks
        ).is({
          callback1: 'hello',
          callback2: 'world'
        });

        done();

      }, {
        msg1: 'hello',
        msg2: 'world'
      });

    });

    it('shouldFireTheCallbackWithoutDoneCallback', function (done) {

      var eventManager = new EventManager(),
          callback = function (next, params) {
            next();
            done();
          };

      eventManager.listen('test', callback);
      eventManager.fire('test');

    });

    it('shouldFireMultipleEvents', function (done) {

      var eventManager = new EventManager(),
          callbacks = {},
          callback1 = function (next, params) {
            callbacks.callback1 = params.msg1;
            next();
          },
          callback2 = function (next, params) {
            callbacks.callback2 = params.msg2;
            next();
          };

      eventManager.listen('test', callback1);
      eventManager.listen('test[2]', callback2);

      eventManager.fire(['test', 'test[2]'], function (err) {

        test.value(
          err
        ).isNull();

        test.object(
          callbacks
        ).is({
          callback1: 'hello',
          callback2: 'world'
        });

        done();

      }, {
        msg1: 'hello',
        msg2: 'world'
      });

    });

    it('shouldCatchErrors', function (done) {

      var eventManager = new EventManager(),
          callbacks = {},
          callback1 = function (next, params) {
            throw new Error();
          },
          callback2 = function (next, params) {
            callbacks.callback2 = params.msg2;
            next();
          };

      eventManager.listen('test', callback1);
      eventManager.listen('test', callback2);

      eventManager.fire('test', function (err) {

        test.value(
          err
        ).isInstanceOf(Error);

        test.object(
          callbacks
        ).is({});

        done();

      }, {
        msg1: 'hello',
        msg2: 'world'
      });

    });

  });

});
