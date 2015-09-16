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
 * Provides the EInvalidCharacters error which is thrown when the provided
 * value contains invalid characters.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to validate a value with invalid characters.
 *
 * @class {EInvalidCharacters}
 * @extends {EError}
 * @param {String} value The value being validated.
 */
function EInvalidCharacters(value) {
  'use strict';

  EInvalidCharacters.super_.call(this);

  /**
   * The value causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'value', {
    value: value
  });
}

util.inherits(EInvalidCharacters, EError);

/**
 * Exports the EInvalidCharacters class.
 */
module.exports = EInvalidCharacters;
