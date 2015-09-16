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
 * Provides the EInvalidLength error which is thrown when the provided value
 * contains too many or too few characters.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when trying to validate a value which is smaller or larger than the
 * min and max requirements.
 *
 * @class {EInvalidLength}
 * @extends {EError}
 * @param {String} value The value being validated.
 * @param {Integer} min The minimum allowed characters.
 * @param {Integer} max The maximum allowed characters.
 */
function EInvalidLength(value, min, max) {
  'use strict';

  EInvalidLength.super_.call(this);

  /**
   * The value causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'value', {
    value: value
  });

  /**
   * The rule's min length.
   *
   * @type {Number}
   */
  Object.defineProperty(this, 'min', {
    value: min
  });

  /**
   * The rule's max length.
   *
   * @type {Number}
   */
  Object.defineProperty(this, 'max', {
    value: max
  });
}

util.inherits(EInvalidLength, EError);

/**
 * Exports the EInvalidLength class.
 */
module.exports = EInvalidLength;
