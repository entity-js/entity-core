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
    loader = require('nsloader'),
    Data = loader('Entity/Utils/Data');

var sConfigFilename = Symbol('Config.filename');

/**
 * The Config class providing methods to access the config options.
 *
 * @extends {Data}
 */
export default class Config extends Data {

  /**
   * Construct the config object.
   *
   * @param {String} filename The filename of the config file.
   */
  constructor(filename) {
    'use strict';

    super(null, '.');
    this[sConfigFilename] = filename;
  }

  /**
   * Get the configs filename.
   *
   * @type {String}
   */
  get filename() {
    'use strict';

    return this[sConfigFilename];
  }

  /**
   * Saves the config file.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any errors raised.
   */
  save(done) {
    'use strict';

    fs.writeFile(
      this.filename,
      JSON.stringify(this.data),
      function (err) {
        done(err ? err : null);
      }
    );
  }

  /**
   * Restores the config object from the config file.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  load(done) {
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
  }

}
