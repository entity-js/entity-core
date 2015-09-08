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
    Sanitizers = loader('Entity/Sanitizers'),
    EUnknownSanitizer = loader('Entity/Sanitizers/Errors/EUnknownSanitizer');

var sRules = Symbol.for('Sanitizers.rules');

describe('entity/Sanitizers', function () {

  'use strict';

  describe('Sanitizers.register()', function () {

    it('shouldBeAbleToRegisterNewSanitizer', function () {

      var sanitizers = new Sanitizers(),
          sanitizer = function () {};

      sanitizers.register('test', sanitizer);

      test.array(
        sanitizers[sRules].test
      ).hasLength(1).is([{
        callback: sanitizer,
        weight: 0
      }]);

    });

    it('shouldBeAbleToRegisterMultipleCallbacks', function () {

      var sanitizers = new Sanitizers(),
          sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      sanitizers
        .register('test', sanitizer1)
        .register('test', sanitizer2)
        .register('test', sanitizer3);

      test.array(
        sanitizers[sRules].test
      ).hasLength(3).is([{
        callback: sanitizer1,
        weight: 0
      }, {
        callback: sanitizer2,
        weight: 0
      }, {
        callback: sanitizer3,
        weight: 0
      }]);

    });

    it('multipleCallbacksShouldBeSortedByWeight', function () {

      var sanitizers = new Sanitizers(),
          sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      sanitizers.register('test', sanitizer1, 10)
        .register('test', sanitizer2, -10)
        .register('test', sanitizer3);

      test.array(
        sanitizers[sRules].test
      ).hasLength(3).is([{
        callback: sanitizer2,
        weight: -10
      }, {
        callback: sanitizer3,
        weight: 0
      }, {
        callback: sanitizer1,
        weight: 10
      }]);

    });

  });

  describe('Sanitizers.registered()', function () {

    it('shouldReturnFalseIfTheSanitizerHasntBeenRegistered', function () {

      var sanitizers = new Sanitizers();

      test.bool(
        sanitizers.registered('test')
      ).isNotTrue();

    });

    it('shouldReturnFalseIfTheSanitizerHasBeenRegisteredButEmpty', function () {

      var sanitizers = new Sanitizers();

      test.bool(
        sanitizers.registered('test')
      ).isNotTrue();

    });

    it('shouldReturnTrueIfSanitizerHasBeenRegistered', function () {

      var sanitizers = new Sanitizers(),
          sanitizer = function () {};

      sanitizers.register('test', sanitizer);

      test.bool(
        sanitizers.registered('test')
      ).isTrue();

    });

  });

  describe('Sanitizers.unregister()', function () {

    it('shouldThrowAnErrorIfSanitizerDoesntExist', function () {

      var sanitizers = new Sanitizers();

      test.error(function () {
        sanitizers.unregister('test');
      })
        .isInstanceOf(EUnknownSanitizer)
        .hasKey('rule', 'test');

    });

    it('shouldUnregisterAllSanitizers', function () {

      var sanitizers = new Sanitizers(),
          sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      sanitizers
        .register('test', sanitizer1, 10)
        .register('test', sanitizer2, -10)
        .register('test', sanitizer3);

      sanitizers.unregister('test');
      test.value(
        sanitizers[sRules].test
      ).isUndefined();

    });

    it('shouldUnregisterSpecifiedCallback', function () {

      var sanitizers = new Sanitizers(),
          sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      sanitizers
        .register('test', sanitizer1, 10)
        .register('test', sanitizer2, -10)
        .register('test', sanitizer3);

      sanitizers.unregister('test', sanitizer2);
      test.array(
        sanitizers[sRules].test
      ).hasLength(2).is([{
        callback: sanitizer3,
        weight: 0
      }, {
        callback: sanitizer1,
        weight: 10
      }]);

    });

    it('shouldUnregisterSpecifiedCallbackDuplicates', function () {

      var sanitizers = new Sanitizers(),
          sanitizer1 = function () {},
          sanitizer2 = function () {},
          sanitizer3 = function () {};

      sanitizers.register('test', sanitizer1, 10)
        .register('test', sanitizer2, -10)
        .register('test', sanitizer3)
        .register('test', sanitizer2, 90);

      sanitizers.unregister('test', sanitizer2);
      test.array(
        sanitizers[sRules].test
      ).hasLength(2).is([{
        callback: sanitizer3,
        weight: 0
      }, {
        callback: sanitizer1,
        weight: 10
      }]);

    });

  });

  describe('Sanitizers.sanitize()', function () {

    it('shouldThrowAnErrorIfSanitizerDoesntExist', function (done) {

      var sanitizers = new Sanitizers();

      sanitizers.sanitize(function (err, orig, value) {

        test.object(err)
          .isInstanceOf(EUnknownSanitizer)
          .hasKey('rule', 'test');

        done();

      }, 'test', 'test');

    });

    it('shouldExecuteCorrectSanitizers', function (done) {

      var sanitizers = new Sanitizers(),
          s1 = false, s2 = false, s3 = false,
          sanitizer1 = function (orig, value, options, next) {
            s1 = true;
            next(null, value);
          },
          sanitizer2 = function (orig, value, options, next) {
            s2 = true;
            next(null, value);
          },
          sanitizer3 = function (orig, value, options, next) {
            s3 = true;
            next(null, value);
          };

      sanitizers.register('test', sanitizer1)
        .register('test2', sanitizer2)
        .register('test', sanitizer3);

      sanitizers.sanitize(function (err, orig, value) {

        test.value(
          err
        ).isNull();

        test.bool(
          s1
        ).isTrue();

        test.bool(
          s2
        ).isNotTrue();

        test.bool(
          s3
        ).isTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldMarkAsInvalidIfAnErrorIsSubmitted', function (done) {

      var sanitizers = new Sanitizers(),
          s1 = false, s2 = false, s3 = false,
          sanitizer1 = function (orig, value, options, next) {
            s1 = true;
            next(null, value);
          },
          sanitizer2 = function (orig, value, options, next) {
            s2 = true;
            next(new Error(), value);
          },
          sanitizer3 = function (orig, value, options, next) {
            s3 = true;
            next(null, value);
          };

      sanitizers.register('test', sanitizer1)
        .register('test', sanitizer2)
        .register('test', sanitizer3);

      sanitizers.sanitize(function (err, orig, value) {

        test.object(
          err
        ).isInstanceOf(Error);

        test.bool(
          s1
        ).isTrue();

        test.bool(
          s2
        ).isTrue();

        test.bool(
          s3
        ).isNotTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldCaptureExceptionsAndFail', function (done) {

      var sanitizers = new Sanitizers(),
          s1 = false, s2 = false, s3 = false,
          sanitizer1 = function (orig, value, options, next) {
            s1 = true;
            next(null, value);
          },
          sanitizer2 = function (orig, value, options, next) {
            throw new Error();
          },
          sanitizer3 = function (orig, value, options, next) {
            s3 = true;
            next(null, value);
          };

      sanitizers.register('test', sanitizer1)
        .register('test', sanitizer2)
        .register('test', sanitizer3);

      sanitizers.sanitize(function (err, orig, value) {

        test.object(
          err
        ).isInstanceOf(Error);

        test.bool(
          s1
        ).isTrue();

        test.bool(
          s2
        ).isNotTrue();

        test.bool(
          s3
        ).isNotTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldSanitizeValue', function (done) {

      var sanitizers = new Sanitizers(),
          sanitizer1 = function (orig, value, options, next) {
            next(null, value.trim());
          },
          sanitizer2 = function (orig, value, options, next) {
            next(null, value.toLowerCase());
          },
          sanitizer3 = function (orig, value, options, next) {
            next(null, value.replace(' ', '-'));
          };

      sanitizers.register('test', sanitizer1)
        .register('test', sanitizer2)
        .register('test', sanitizer3);

      sanitizers.sanitize(function (err, orig, value) {

        test.value(
          err
        ).isNull();

        test.string(
          orig
        ).is('  HELLO WORLD  ');

        test.string(
          value
        ).is('hello-world');

        done();

      }, 'test', '  HELLO WORLD  ');

    });

  });

});
