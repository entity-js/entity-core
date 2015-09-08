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
 * Provides the machine name validator rule.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EInvalidLength = loader('Entity/Validators/Errors/EInvalidLength'),
    EInvalidCharacters = loader(
      'Entity/Validators/Errors/EInvalidCharacters'
    );

/**
 * Validate machine name.
 *
 * @param {Mixed} value The value to validate.
 * @param {Object} options The options passed to the validator.
 * @param {Function} next The next callback.
 * @param {Error} next.err Any raised errors.
 * @throws {EInvalidLength} Thrown if the value is too long or short.
 * @throws {EInvalidCharacters} If the value contains invalid characters.
 */
export default function validateMachineName(value, options, next) {
  'use strict';

  var min = 3,
      max = 128;

  if (value.length < min || value.length > max) {
    return next(new EInvalidLength(value, min, max));
  }

  if (value.match(/[^-_a-z0-9]/) !== null) {
    return next(new EInvalidCharacters(value));
  }

  next();
}
