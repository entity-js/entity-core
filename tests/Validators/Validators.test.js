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
    Validators = loader('Entity/Validators'),
    EUnknownValidator = loader('Entity/Validators/Errors/EUnknownValidator');

var sRules = Symbol.for('Validators.rules');

describe('entity/Validators', function () {

  'use strict';

  describe('Validators.register()', function () {

    it('shouldBeAbleToRegisterNewValidator', function () {

      var validators = new Validators(),
          validator = function () {};

      validators.register('test', validator);

      test.array(
        validators[sRules].test
      ).hasLength(1).is([{
        callback: validator,
        weight: 0
      }]);

    });

    it('shouldBeAbleToRegisterMultipleCallbacks', function () {

      var validators = new Validators(),
          validator1 = function () {},
          validator2 = function () {},
          validator3 = function () {};

      validators
        .register('test', validator1)
        .register('test', validator2)
        .register('test', validator3);

      test.array(
        validators[sRules].test
      ).hasLength(3).is([{
        callback: validator1,
        weight: 0
      }, {
        callback: validator2,
        weight: 0
      }, {
        callback: validator3,
        weight: 0
      }]);

    });

    it('multipleCallbacksShouldBeSortedByWeight', function () {

      var validators = new Validators(),
          validator1 = function () {},
          validator2 = function () {},
          validator3 = function () {};

      validators
        .register('test', validator1, 10)
        .register('test', validator2, -10)
        .register('test', validator3);

      var rules = validators[sRules].test;
      test.array(
        rules
      ).hasLength(3);

      test.object(
        rules[0]
      ).is({
        callback: validator2,
        weight: -10
      });

      test.object(
        rules[1]
      ).is({
        callback: validator3,
        weight: 0
      });

      test.object(
        rules[2]
      ).is({
        callback: validator1,
        weight: 10
      });

    });

  });

  describe('Validators.registered()', function () {

    it('shouldReturnFalseIfTheValidatorHasntBeenRegistered', function () {

      var validators = new Validators();

      test.bool(
        validators.registered('test')
      ).isNotTrue();

    });

    it('shouldReturnTrueIfValidatorHasBeenRegistered', function () {

      var validators = new Validators(),
          validator = function () {};

      validators.register('test', validator);

      test.bool(
        validators.registered('test')
      ).isTrue();

    });

  });

  describe('Validators.unregister()', function () {

    it('shouldThrowAnErrorIfValidatorDoesntExist', function () {

      var validators = new Validators();

      test.exception(function () {
        validators.unregister('test');
      })
        .isInstanceOf(EUnknownValidator)
        .hasKey('rule', 'test');

    });

    it('shouldUnregisterAllValidators', function () {

      var validators = new Validators(),
          validator1 = function () {},
          validator2 = function () {},
          validator3 = function () {};

      validators
        .register('test', validator1, 10)
        .register('test', validator2, -10)
        .register('test', validator3);

      validators.unregister('test');
      test.value(
        validators[sRules].test
      ).isUndefined();

    });

    it('shouldUnregisterSpecifiedCallback', function () {

      var validators = new Validators(),
          validator1 = function () {},
          validator2 = function () {},
          validator3 = function () {};

      validators
        .register('test', validator1, 10)
        .register('test', validator2, -10)
        .register('test', validator3);

      validators.unregister('test', validator2);
      test.array(
        validators[sRules].test
      ).hasLength(2).is([{
        callback: validator3,
        weight: 0
      }, {
        callback: validator1,
        weight: 10
      }]);

    });

    it('shouldUnregisterSpecifiedCallbackDuplicates', function () {

      var validators = new Validators(),
          validator1 = function () {},
          validator2 = function () {},
          validator3 = function () {};

      validators
        .register('test', validator1, 10)
        .register('test', validator2, -10)
        .register('test', validator3)
        .register('test', validator2, 90);

      validators.unregister('test', validator2);
      test.array(
        validators[sRules].test
      ).hasLength(2).is([{
        callback: validator3,
        weight: 0
      }, {
        callback: validator1,
        weight: 10
      }]);

    });

    it('shouldRemoveTheRuleIfDeletingCallbackLeavesNoItems', function () {

      var validators = new Validators(),
          validator = function () {};

      validators.register('test', validator);

      validators.unregister('test', validator);
      test.value(
        validators[sRules].test
      ).isUndefined();

    });

  });

  describe('Validators.validate()', function () {

    it('shouldThrowAnErrorIfValidatorDoesntExist', function (done) {

      var validators = new Validators();

      validators.validate(function (err) {

        test.object(err)
          .isInstanceOf(EUnknownValidator)
          .hasKey('rule', 'test');

        done();

      }, 'test', 'test');

    });

    it('shouldExecuteCorrectValidators', function (done) {

      var validators = new Validators(),
          v1 = false, v2 = false, v3 = false,
          validator1 = function (value, options, next) {
            v1 = true;
            next();
          },
          validator2 = function (value, options, next) {
            v2 = true;
            next();
          },
          validator3 = function (value, options, next) {
            v3 = true;
            next();
          };

      validators
        .register('test', validator1)
        .register('test2', validator2)
        .register('test', validator3);

      validators.validate(function (err) {

        test.value(
          err
        ).isNull();

        test.bool(
          v1
        ).isTrue();

        test.bool(
          v2
        ).isNotTrue();

        test.bool(
          v3
        ).isTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldMarkAsInvalidIfAnErrorIsSubmitted', function (done) {

      var validators = new Validators(),
          v1 = false, v2 = false, v3 = false,
          validator1 = function (value, options, next) {
            v1 = true;
            next();
          },
          validator2 = function (value, options, next) {
            v2 = true;
            next(new Error());
          },
          validator3 = function (value, options, next) {
            v3 = true;
            next();
          };

      validators
        .register('test', validator1)
        .register('test', validator2)
        .register('test', validator3);

      validators.validate(function (err) {

        test.object(
          err
        ).isInstanceOf(Error);

        test.bool(
          v1
        ).isTrue();

        test.bool(
          v2
        ).isTrue();

        test.bool(
          v3
        ).isNotTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldCaptureExceptionsAndFail', function (done) {

      var validators = new Validators(),
          v1 = false, v2 = false, v3 = false,
          validator1 = function (value, options, next) {
            v1 = true;
            next();
          },
          validator2 = function (value, options, next) {
            throw new Error();
          },
          validator3 = function (value, options, next) {
            v3 = true;
            next();
          };

      validators
        .register('test', validator1)
        .register('test', validator2)
        .register('test', validator3);

      validators.validate(function (err) {

        test.object(
          err
        ).isInstanceOf(Error);

        test.bool(
          v1
        ).isTrue();

        test.bool(
          v2
        ).isNotTrue();

        test.bool(
          v3
        ).isNotTrue();

        done();

      }, 'test', 'test');

    });

    it('shouldPassOptions', function (done) {

      var validators = new Validators(),
          v = '',
          validator1 = function (value, options, next) {
            v += options.opt;
            options.opt = ' world';
            next();
          },
          validator2 = function (value, options, next) {
            v += options.opt;
            next();
          };

      validators
        .register('test', validator1)
        .register('test', validator2);

      validators.validate(function (err) {

        test.value(
          err
        ).isNull();

        test.string(
          v
        ).is('Hello world');

        done();

      }, 'test', 'test', {opt: 'Hello'});

    });

  });

  describe('Validators.rules', function () {

    it('shouldProvideTheRegisteredRules', function () {

      var validators = new Validators(),
          validator = function () {};

      validators.register('test', validator);

      test.array(
        validators.rules
      ).contains(['test']);

    });

  });

});
