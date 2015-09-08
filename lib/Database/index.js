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

var sDefaultConnection = Symbol('Database.defaultConnection'),
    sConnections = Symbol('Database.connections');

/**
 * The database manager allows setting up multiple MongoDB connections.
 */
export default class Database {

  /**
   * The class constructor.
   */
  constructor() {
    'use strict';

    this[sDefaultConnection] = '';
    this[sConnections] = {};
  }

  /**
   * The default connection name.
   *
   * @type {String}
   */
  get defaultConnection() {
    'use strict';

    return this[sDefaultConnection];
  }

  /**
   * The default connection name.
   *
   * @type {String}
   */
  set defaultConnection(name) {
    'use strict';

    if (!this[sConnections][name]) {
      throw new EUndefinedConnection(name);
    }

    this[sDefaultConnection] = name;
  }

  /**
   * Get a list of the defined connection names.
   *
   * @type {Array}
   */
  get connections() {
    'use strict';

    return Object.keys(this[sConnections]);
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
  connect(name, config, def) {
    'use strict';

    if (this[sConnections][name] !== undefined) {
      throw new EDefinedConnection(name);
    }

    if (Object.keys(this[sConnections]).length === 0) {
      def = true;
    }

    this[sConnections][name] = new Connection(name, config);
    if (def === true) {
      this[sDefaultConnection] = name;
    }

    return this;
  }

  /**
   * Disconnect and destroys the specified connection.
   *
   * @param {String} [name] The connection name, if not specified the default
   *   connection name is used.
   * @return {Database} Returns self.
   * @throws {EUndefinedConnection} Thrown if the connection doesnt exist.
   */
  disconnect(name) {
    'use strict';

    name = name || this.defaultConnection;

    if (this[sConnections][name] === undefined) {
      throw new EUndefinedConnection(name);
    }

    this[sConnections][name].disconnect();
    delete this[sConnections][name];

    if (this[sDefaultConnection] === name) {
      this[sDefaultConnection] = '';
    }

    return this;
  }

  /**
   * Get the defined connection.
   *
   * @param {String} [name] The connection name, if not provided the default
   *   connection name is assumed.
   * @return {Connection} The connection.
   * @throws {EUndefinedConnection} Thrown if the connection hasnt been defined.
   */
  connection(name) {
    'use strict';

    name = name || this.defaultConnection;
    if (this[sConnections][name] === undefined) {
      throw new EUndefinedConnection(name);
    }

    return this[sConnections][name];
  }

  /**
   * Gets a mongo collection.
   *
   * @param {String} name The name of the collection to return.
   * @param {String} [connection] The name of the collection, if not provided
   *   the default connection will be used.
   * @return {Collection} Returns a mongodb collection.
   * @throws {EUndefinedConnection} Thrown if the connection is undefined.
   */
  collection(name, connection) {
    'use strict';

    connection = connection || this.defaultConnection;
    if (this[sConnections][connection] === undefined) {
      throw new EUndefinedConnection(connection);
    }

    return this[sConnections][connection].collection(name);
  }

}
