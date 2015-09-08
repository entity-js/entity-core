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
 * Provides the EUndefinedEvent error which is used when attempting to use an
 * undefined event.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sEventName = Symbol('EUndefinedEvent.eventName');

/**
 * Thrown when tryng to use an undefined event.
 *
 * @extends {EError}
 */
export default class EUndefinedEvent extends EError {

  /**
   * The error constructor.
   *
   * @param {String} name The name of the event.
   */
  constructor(name) {
    'use strict';

    super();
    this[sEventName] = name;
  }

  /**
   * The event name causing the error.
   *
   * @type {String}
   */
  get eventName() {
    'use strict';

    return this[sEventName];
  }

}
