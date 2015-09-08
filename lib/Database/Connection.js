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

var mongojs = require('mongojs'),
    loader = require('nsloader');

var sDb = Symbol('Connection.db'),
    sName = Symbol('Connection.name');

/**
 * The Database connection class, used to connect to a MongoDB database.
 */
export default class Connection {

  /**
   * The connection class constructor.
   *
   * @param {String} name The unique ID of the database connection.
   * @param {Object} config The database config object.
   * @param {String} config.name The name of the database to use.
   * @param {String} [config.user] The database username.
   * @param {String} [config.pass] The database password.
   * @param {String} [config.host='0.0.0.0'] The database host.
   * @param {Integer} [config.port=27017] The database port.
   */
  constructor(name, config) {
    'use strict';

    Object.assign(config, {
      host: '0.0.0.0',
      port: 27017
    });

    this[sName] = name;
    this[sDb] = mongojs(this._configToURI(config));

    var me = this;
    this[sDb].on('error', function (err) {
      loader('Entity').eventManager.fire('database.connection.error', null, {
        connection: me,
        err: err
      });
    });

    this[sDb].on('ready', function () {
      loader('Entity').eventManager.fire('database.connection.ready', null, {
        connection: me
      });
    });
  }

  /**
   * The name of the connection.
   *
   * @type {String}
   */
  get name() {
    'use strict';

    return this[sName];
  }

  /**
   * The mongo database connection.
   *
   * @type {MongoDB}
   */
  get database() {
    'use strict';

    return this[sDb];
  }

  /**
   * Build a connection URI from a config bject.
   *
   * @param {Object} config The config object.
   * @return {String} The generated connection URI.
   * @private
   */
  _configToURI(config) {
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
  }

  /**
   * Get a collection from the mongo database.
   *
   * @param {String} collection The name of the collection to return.
   * @returns {Collection} A mongodb collection.
   */
  collection(name) {
    'use strict';

    return this[sDb].collection(name);
  }

  /**
   * Disconnects the database connection.
   *
   * @returns {Connection} Returns self.
   */
  disconnect() {
    'use strict';

    this[sDb].close();
    return this;
  }

}
