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
 * Provides the EMustContainDigit error which is thrown when the provided value
 * doesnt conain at least 1 digit.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to validate a value which doesnt contain at least 1 digit.
 *
 * @class {EMustContainDigit}
 * @extends {EError}
 * @param {String} value The value being validated.
 */
function EMustContainDigit(value) {
  'use strict';

  EMustContainDigit.super_.call(this);

  /**
   * The value causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'value', {
    value: value
  });
}

util.inherits(EMustContainDigit, EError);

/**
 * Exports the EMustContainDigit class.
 */
module.exports = EMustContainDigit;
