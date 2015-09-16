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
 * Provides the EMustContainLowercase error which is thrown when the provided
 * value doesnt conain at least 1 uppercase character.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to validate a value which doesnt contain at least 1
 * uppercase character.
 *
 * @class {EMustContainUppercase}
 * @extends {EError}
 * @param {String} value The value being validated.
 */
function EMustContainUppercase(value) {
  'use strict';

  EMustContainUppercase.super_.call(this);

  /**
   * The value causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'value', {
    value: value
  });
}

util.inherits(EMustContainUppercase, EError);

/**
 * Exports the EMustContainUppercase class.
 */
module.exports = EMustContainUppercase;
