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

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sRule = Symbol('EUnknownValidator.rule');

/**
 * Thrown when tryng to use an unknown validator.
 *
 * @extends {EError}
 */
export default class EUnknownValidator extends EError {

  /**
   * The error constructor.
   *
   * @param {String} rule The rule being validated.
   */
  constructor(rule) {
    'use strict';

    super();
    this[sRule] = rule;
  }

  /**
   * The rule causing the error.
   *
   * @type {String}
   */
  get rule() {
    'use strict';

    return this[sRule];
  }

}
