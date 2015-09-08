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
    EInvalidValue = loader('Entity/Sanitizers/Errors/EInvalidValue');

describe('entity/Sanitizers/Rules/Trim', function () {

  'use strict';

  it('sanitizerShouldBeAvailable', function () {

    var sanitizers = new Sanitizers();

    test.bool(
      sanitizers.registered('trim')
    ).isTrue();

  });

  it('shouldThrowErrorIfNotString', function (done) {

    var sanitizers = new Sanitizers();

    sanitizers.sanitize(function (err, orig, value) {

      test.object(err)
        .isInstanceOf(EInvalidValue)
        .hasKey('value', orig);

      done();

    }, 'trim', false);

  });

  it('shouldTrimProvidedValue', function (done) {

    var sanitizers = new Sanitizers();

    sanitizers.sanitize(function (err, orig, value) {

      test.value(
        err
      ).isNull();

      test.value(
        orig
      ).is(' john doe  ');

      test.value(
        value
      ).is('john doe');

      done();

    }, 'trim', ' john doe  ');

  });

});
