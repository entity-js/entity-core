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

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to use an undefined event.
 *
 * @class
 * @extends {EError}
 * @param {String} name The name of the event.
 */
function EUndefinedEvent (name) {
  'use strict';

  EUndefinedEvent.super_.call(this);

  /**
   * The event name causing the error.
   *
   * @var {String} eventName
   * @memberof EUndefinedEvent
   * @readonly
   * @instance
   */
  Object.defineProperty(this, 'eventName', {
    value: name
  });
}

util.inherits(EUndefinedEvent, EError);

/**
 * Exports the EundefinedEvent class.
 */
module.exports = EUndefinedEvent;
