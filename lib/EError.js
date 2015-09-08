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
 * Provides the EError class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var sName = Symbol('EError.name'),
    sStack = Symbol('EError.stack');

/**
 * Provides an abstract Error class to be overriden.
 *
 * @extends {Error}
 */
export default class EError extends Error {

  /**
   * The error constructor.
   */
  constructor() {
    'use strict';

    super();

    this[sName] = this.constructor.name;
    this[sStack] = (new Error()).stack;
  }

  /**
   * Get the errors constructor name.
   *
   * @type {String}
   */
  get name() {
    'use strict';

    return this[sName];
  }

  /**
   * Get the errors stack.
   *
   * @type {Object}
   */
  get stack() {
    'use strict';

    return this[sStack];
  }

}
