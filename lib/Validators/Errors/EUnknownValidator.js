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
 * Provides the EUnknownValidator error which is used when attempting to use
 * an unknown validator.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to use an unknown validator.
 *
 * @class {EUnknownValidator}
 * @extends {EError}
 * @param {String} rule The rule being validated.
 */
function EUnknownValidator(rule) {
  'use strict';

  EUnknownValidator.super_.call(this);

  /**
   * The rule causing the error.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'rule', {
    value: rule
  });
}

util.inherits(EUnknownValidator, EError);

/**
 * Exports the EUnknownValidator class.
 */
module.exports = EUnknownValidator;
