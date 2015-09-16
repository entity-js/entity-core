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
 * Provides the EUndefinedConnection error which is used when attempting to use
 * an undefined connection.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    loader = require('nsloader'),
    EError = loader('Entity/EError');

/**
 * Thrown when tryng to use an undefined connection.
 *
 * @class EUndefinedConnection
 * @extends EError
 * @param {String} name The name of the connection.
 */
function EUndefinedConnection (name) {
  'use strict';

  EUndefinedConnection.super_.call(this);

  /**
   * The connection name causing the error.
   *
   * @type String
   */
  Object.defineProperty(this, 'connectionName', {
    value: name
  });

}

util.inherits(EUndefinedConnection, EError);

/**
 * Exports the EUndefinedConnection class.
 */
module.exports = EUndefinedConnection;
