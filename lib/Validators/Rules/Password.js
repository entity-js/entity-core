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

/**
 * Provides the password validator rule.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
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

/**
 * Validate password.
 *
 * @param {Mixed} value The value to validate.
 * @param {Object} options The options passed to the validator.
 * @param {Function} next The next callback.
 * @param {Error} next.err Any raised errors.
 * @throws {EInvalidLength} Thrown if the value is too long or short.
 * @throws {EInvalidCharacters} If the value contains invalid characters.
 */
module.exports = function validatePassword(value, options, next) {
  'use strict';

  var min = options.minLength || 5,
      max = options.maxLength || 128;

  if (value.length < min || value.length > max) {
    return next(new EInvalidLength(value, min, max));
  }

  if (value.match(/^.*(?=\d).*$/) === null) {
    return next(new EMustContainDigit(value));
  }

  if (value.match(/^.*(?=[a-z]).*$/) === null) {
    return next(new EMustContainLowercase(value));
  }

  if (value.match(/^.*(?=[A-Z]).*$/) === null) {
    return next(new EMustContainUppercase(value));
  }

  if (value.match(/[^0-9a-zA-Z!%^&*\-_+#~@?]/) !== null) {
    return next(new EInvalidCharacters(value));
  }

  next();
};
