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
 * Provides the Database class managing connections.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    Connection = loader('Entity/Database/Connection'),
    EUndefinedConnection = loader(
      'Entity/Database/Errors/EUndefinedConnection'
    ),
    EDefinedConnection = loader('Entity/Database/Errors/EDefinedConnection');

/**
 * The database manager allows setting up multiple MongoDB connections.
 *
 * @class {Database}
 * @param {EntityCore} core The owning entity core obejct.
 */
function Database (core) {
  'use strict';

  var defaultConnection = '',
      connections = {};

  /**
   * The owner core object.
   *
   * @type {EntityCore}
   * @readOnly
   */
  Object.defineProperty(this, 'core', {
    value: core
  });

  /**
   * The internal defined connections.
   *
   * @type {Object}
   * @private
   */
  Object.defineProperty(this, '_connections', {
    get: function () {
      return connections;
    }
  });

  /**
   * The default connection name.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'defaultConnection', {
    get: function () {
      return defaultConnection;
    },
    set: function (value) {
      if (value !== '' && !connections[value]) {
        throw new EUndefinedConnection(value);
      }

      defaultConnection = value;
    }
  });

  /**
   * Get a list of the defined connection names.
   *
   * @type {Array}
   * @readOnly
   */
  Object.defineProperty(this, 'connections', {
    get: function () {
      return Object.keys(connections);
    }
  });
}

/**
 * Connect to a database.
 *
 * @param {String} name The name to give the connection.
 * @param {Object} config The database connection config.
 * @param {Boolean} [def=false] Make this the default connection.
 * @return {Database} Returns self.
 * @throws {EDefinedConnection} Thrown if the connection has already been
 *   defined.
 */
Database.prototype.connect = function (name, config, def) {
  'use strict';

  if (this._connections[name] !== undefined) {
    throw new EDefinedConnection(name);
  }

  if (Object.keys(this._connections).length === 0) {
    def = true;
  }

  this._connections[name] = new Connection(this, name, config);
  if (def === true) {
    this.defaultConnection = name;
  }

  return this;
};

/**
 * Disconnect and destroys the specified connection.
 *
 * @param {String} [name] The connection name, if not specified the default
 *   connection name is used.
 * @return {Database} Returns self.
 * @throws {EUndefinedConnection} Thrown if the connection doesnt exist.
 */
Database.prototype.disconnect = function (name) {
  'use strict';

  name = name || this.defaultConnection;

  if (this._connections[name] === undefined) {
    throw new EUndefinedConnection(name);
  }

  this._connections[name].disconnect();
  delete this._connections[name];

  if (this.defaultConnection === name) {
    this.defaultConnection = '';
  }

  return this;
};

/**
 * Get the defined connection.
 *
 * @param {String} [name] The connection name, if not provided the default
 *   connection name is assumed.
 * @return {Connection} The connection.
 * @throws {EUndefinedConnection} Thrown if the connection hasnt been defined.
 */
Database.prototype.connection = function (name) {
  'use strict';

  name = name || this.defaultConnection;
  if (this._connections[name] === undefined) {
    throw new EUndefinedConnection(name);
  }

  return this._connections[name];
};

/**
 * Gets a mongo collection.
 *
 * @param {String} name The name of the collection to return.
 * @param {String} [connection] The name of the collection, if not provided
 *   the default connection will be used.
 * @return {Collection} Returns a mongodb collection.
 * @throws {EUndefinedConnection} Thrown if the connection is undefined.
 */
Database.prototype.collection = function (name, connection) {
  'use strict';

  connection = connection || this.defaultConnection;
  if (this._connections[connection] === undefined) {
    throw new EUndefinedConnection(connection);
  }

  return this._connections[connection].collection(name);
};

/**
 * Exports the Database class.
 */
module.exports = Database;
