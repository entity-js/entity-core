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
    EInvalidLength = loader(
      'Entity/Validators/Errors/EInvalidLength'
    ),
    EInvalidCharacters = loader(
      'Entity/Validators/Errors/EInvalidCharacters'
    ),
    EMustContainDigit = loader(
      'Entity/Validators/Errors/EMustContainDigit'
    ),
    EMustContainLowercase = loader(
      'Entity/Validators/Errors/EMustContainLowercase'
    ),
    EMustContainUppercase = loader(
      'Entity/Validators/Errors/EMustContainUppercase'
    );

describe('entity/Validators/Rules/Password', function () {

  'use strict';

  it('validatorShouldBeAvailable', function () {

    var validators = new Validators();

    test.bool(
      validators.registered('password')
    ).isTrue();

  });

  it('shouldThrowAnInvalidLengthErrorTooFew', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidLength)
        .hasKey('value', 'test')
        .hasKey('min', 5)
        .hasKey('max', 128);

      done();

    }, 'password', 'test');

  });

  it('shouldThrowAnInvalidLengthErrorTooMany', function (done) {

    var validators = new Validators(),
        str = '';

    for (var i = 0; i < 130; i++) {
      str += 'a';
    }

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidLength)
        .hasKey('value', str)
        .hasKey('min', 5)
        .hasKey('max', 128);

      done();

    }, 'password', str);

  });

  it('shouldThrowAnNoDigitError', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EMustContainDigit)
        .hasKey('value', 'testpassword');

      done();

    }, 'password', 'testpassword');

  });

  it('shouldThrowAnNoLowercaseError', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EMustContainLowercase)
        .hasKey('value', 'TESTPASSWORD1');

      done();

    }, 'password', 'TESTPASSWORD1');

  });

  it('shouldThrowAnNoUppercaseError', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EMustContainUppercase)
        .hasKey('value', 'testpassword1');

      done();

    }, 'password', 'testpassword1');

  });

  it('shouldThrowAnInvalidCharactersError', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidCharacters)
        .hasKey('value', 'Test Password 1');

      done();

    }, 'password', 'Test Password 1');

  });

  it('shouldValidateAsValid', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.value(
        err
      ).isNull();

      done();

    }, 'password', 'TestPassword1');

  });

});
