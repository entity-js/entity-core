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
    EInvalidLength = loader('Entity/Validators/Errors/EInvalidLength'),
    EInvalidCharacters = loader(
      'Entity/Validators/Errors/EInvalidCharacters'
    );

describe('entity/Validators/Rules/MachineName', function () {

  'use strict';

  it('validatorShouldBeAvailable', function () {

    var validators = new Validators();

    test.bool(
      validators.registered('machine-name')
    ).isTrue();

  });

  it('shouldThrowAnInvalidLengthForTooFew', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidLength)
        .hasKey('value', 't')
        .hasKey('min', 3)
        .hasKey('max', 128);

      done();

    }, 'machine-name', 't');

  });

  it('shouldThrowAnInvalidLengthForTooMany', function (done) {

    var validators = new Validators(),
        str = '';

    for (var i = 0; i < 130; i++) {
      str += 'a';
    }

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidLength)
        .hasKey('value', str)
        .hasKey('min', 3)
        .hasKey('max', 128);

      done();

    }, 'machine-name', str);

  });

  it('shouldThrowAnInvalidCharacters', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidCharacters)
        .hasKey('value', 'John Doe');

      done();

    }, 'machine-name', 'John Doe');

  });

  it('shouldValidateAsValid', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.value(
        err
      ).isNull();

      done();

    }, 'machine-name', 'john-doe');

  });

});
