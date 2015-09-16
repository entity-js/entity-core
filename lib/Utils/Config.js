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
 * Provides the Config class allowing access to the config.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var fs = require('fs'),
    util = require('util'),
    loader = require('nsloader'),
    Data = loader('Entity/Utils/Data');

/**
 * The Config class providing methods to access the config options.
 *
 * @class
 * @extends Data
 * @param {EntityCore} core The owning entity core object.
 * @param {String} filename The filename of the config file.
 */
function Config(core, filename) {
  'use strict';

  Config.super_.call(this, null, '.');

  Object.defineProperties(this, {
    /**
     * Get the owning core object.
     *
     * @var {EntityCore} core
     * @memberof Config
     * @readonly
     * @instance
     */
    core: {
      value: core
    },
    /**
     * Get the configs filename.
     *
     * @var {String} filename
     * @memberof Config
     * @readonly
     * @instance
     */
    filename: {
      value: filename
    }
  });
}

util.inherits(Config, Data);

/**
 * Saves the config file.
 *
 * @param {Function} done The done callback.
 *   @param {Error} done.err Any errors raised.
 */
Config.prototype.save = function (done) {
  'use strict';

  fs.writeFile(
    this.filename,
    JSON.stringify(this.data),
    function (err) {
      done(err ? err : null);
    }
  );
};

/**
 * Restores the config object from the config file.
 *
 * @param {Function} done The done callback.
 *   @param {Error} done.err Any raised errors.
 */
Config.prototype.load = function (done) {
  'use strict';

  if (this.filename === '') {
    return done(new Error());
  }

  var me = this;
  fs.readFile(this.filename, function (err, data) {
    if (err) {
      return done(err);
    }

    try {
      me.data = JSON.parse(data);
      done(null);
    } catch (e) {
      done(e);
    }
  });
};

/**
 * Exports the Config class.
 */
module.exports = Config;
