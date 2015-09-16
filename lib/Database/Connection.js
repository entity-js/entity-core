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
 * Provides the database Connection class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var mongojs = require('mongojs');

/**
 * The Database connection class, used to connect to a MongoDB database.
 *
 * @param {Database} manager The database manager.
 * @param {String} name The unique ID of the database connection.
 * @param {Object} config The database config object.
 * @param {String} config.name The name of the database to use.
 * @param {String} [config.user] The database username.
 * @param {String} [config.pass] The database password.
 * @param {String} [config.host='0.0.0.0'] The database host.
 * @param {Integer} [config.port=27017] The database port.
 */
function Connection (manager, name, config) {
  'use strict';

  Object.assign(config, {
    host: '0.0.0.0',
    port: 27017
  });

  var me = this,
      db = mongojs(this._configToURI(config));

  /**
   * The database manager.
   *
   * @type {Database}
   */
  Object.defineProperty(this, 'manager', {
    value: manager
  });

  /**
   * The name of the connection.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'name', {
    value: name
  });

  /**
   * The mongo database connection.
   *
   * @type {MongoDB}
   */
  Object.defineProperty(this, 'database', {
    value: db
  });

  if (manager && manager.core) {
    db.on('error', function (err) {
      manager.core.eventManager.fire('database.connection.error', null, {
        connection: me,
        err: err
      });
    });

    db.on('ready', function () {
      manager.core.eventManager.fire('database.connection.ready', null, {
        connection: me
      });
    });
  }
}

/**
 * Build a connection URI from a config bject.
 *
 * @param {Object} config The config object.
 * @return {String} The generated connection URI.
 * @private
 */
Connection.prototype._configToURI = function (config) {
  'use strict';

  var uri = '';
  if (config.user) {
    uri += config.user;

    if (config.pass) {
      uri += ':' + config.pass;
    }

    uri += '@';
  }

  uri += config.host ? config.host : '0.0.0.0';
  if (config.port) {
    uri += ':' + config.port;
  }

  uri += '/' + config.name;
  return uri;
};

/**
 * Get a collection from the mongo database.
 *
 * @param {String} collection The name of the collection to return.
 * @returns {Collection} A mongodb collection.
 */
Connection.prototype.collection = function (name) {
  'use strict';

  return this.database.collection(name);
};

/**
 * Disconnects the database connection.
 *
 * @returns {Connection} Returns self.
 */
Connection.prototype.disconnect = function () {
  'use strict';

  this.database.close();
  return this;
};

/**
 * Exports the Connection class.
 */
module.exports = Connection;
