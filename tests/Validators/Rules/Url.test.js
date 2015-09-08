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
    EInvalidURL = loader('Entity/Validators/Errors/EInvalidURL');

describe('entity/Validators/Rules/Url', function () {

  'use strict';

  it('validatorShouldBeAvailable', function () {

    var validators = new Validators();

    test.bool(
      validators.registered('url')
    ).isTrue();

  });

  it('shouldThrowAnInvalidUrl', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidURL)
        .hasKey('value', 'test');

      done();

    }, 'url', 'test');

  });

  it('shouldNotValidateLocalhostAsValid', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidURL)
        .hasKey('value', 'http://localhost');

      done();

    }, 'url', 'http://localhost');

  });

  it('shouldNotValidateLocalIPAsValid', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.object(err)
        .isInstanceOf(EInvalidURL)
        .hasKey('value', 'http://127.0.0.1');

      done();

    }, 'url', 'http://127.0.0.1');

  });

  it('shouldValidateAsValid', function (done) {

    var validators = new Validators();

    validators.validate(function (err) {

      test.value(
        err
      ).isNull();

      done();

    }, 'url', 'http://google.com');

  });

});
