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

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sConnectionName = Symbol('EUndefinedConnection.connectionName');

/**
 * Thrown when tryng to use an undefined connection.
 *
 * @class EUndefinedConnection
 * @extends EError
 */
export default class EUndefinedConnection extends EError {

  /**
   * The error constructor.
   *
   * @param {String} name The name of the connection.
   */
  constructor(name) {
    'use strict';

    super();
    this[sConnectionName] = name;
  }

  /**
   * The connection name causing the error.
   *
   * @type String
   */
  get connectionName() {
    'use strict';

    return this[sConnectionName];
  }

}
