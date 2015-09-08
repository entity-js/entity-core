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

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sValue = Symbol('EMustContainUppercase.value');

/**
 * Thrown when tryng to validate a value which doesnt contain at least 1
 * uppercase character.
 *
 * @extends {EError}
 */
export default class EMustContainUppercase extends EError {

  /**
   * The error constructor.
   *
   * @param {String} value The value being validated.
   */
  constructor(value) {
    'use strict';

    super();
    this[sValue] = value;
  }

  /**
   * The value causing the error.
   *
   * @type {String}
   */
  get value() {
    'use strict';

    return this[sValue];
  }

}
