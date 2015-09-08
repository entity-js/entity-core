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

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sValue = Symbol('EInvalidLength.value'),
    sMin = Symbol('EInvalidLength.min'),
    sMax = Symbol('EInvalidLength.max');

/**
 * Thrown when trying to validate a value which is smaller or larger than the
 * min and max requirements.
 *
 * @extends {EError}
 */
export default class EInvalidLength extends EError {

  /**
   * The error constructor.
   *
   * @param {String} value The value being validated.
   * @param {Integer} min The minimum allowed characters.
   * @param {Integer} max The maximum allowed characters.
   */
  constructor(value, min, max) {
    'use strict';

    super();
    this[sValue] = value;
    this[sMin] = min;
    this[sMax] = max;
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

  /**
   * The rule's min length.
   *
   * @type {Number}
   */
  get min() {
    'use strict';

    return this[sMin];
  }

  /**
   * The rule's max length.
   *
   * @type {Number}
   */
  get max() {
    'use strict';

    return this[sMax];
  }

}
