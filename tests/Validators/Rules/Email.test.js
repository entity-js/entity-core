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
    EInvalidEmail = loader('Entity/Validators/Errors/EInvalidEmail');

describe('entity/Validators/Rules/Email', function () {

  'use strict';

  it('validatorShouldBeAvailable', function () {

      var validators = new Validators();

      test.bool(
        validators.registered('email')
      ).isTrue();

    });

  it('shouldThrowAnInvalidEmail', function (done) {

      var validators = new Validators();

      validators.validate(function (err) {

        test.object(err)
          .isInstanceOf(EInvalidEmail)
          .hasKey('value', 'test.com');

        done();

      }, 'email', 'test.com');

    });

  it('shouldValidateAsValid', function (done) {

      var validators = new Validators();

      validators.validate(function (err) {

        test.value(
          err
        ).isNull();

        done();

      }, 'email', 'john-doe@example.com');

    });

});
