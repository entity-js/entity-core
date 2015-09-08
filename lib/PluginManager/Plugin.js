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
 * The base plugin class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var sName = Symbol('Plugin.name'),
    sInfo = Symbol('Plugin.info');

/**
 * The plugin base class.
 */
export default class Plugin {

  /**
   * Constructor for the plugin class.
   *
   * @param {String} name The name of the plugin.
   * @param {Object} info The info object for the plugin.
   */
  constructor(name, info) {
    'use strict';

    this[sName] = name;
    this[sInfo] = info;
  }

  /**
   * The name of the plugin.
   *
   * @type {String}
   */
  get name() {
    'use strict';

    return this[sName];
  }

  /**
   * The plugin info object.
   *
   * @type {Object}
   */
  get info() {
    'use strict';

    return this[sInfo];
  }

  /**
   * Boot the plugin, this is called by the plugin manager when the plugin is
   * booting. This will run when enabling everytime.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  boot(done) {
    'use strict';

    // @todo - does nothing.

    done(null);
  }

  /**
   * Enabling the plugin, this is called by the plugin manager when the plugin
   * has been enabled for the first time the plugin is enabled or after being
   * disabled.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  enable(done) {
    'use strict';

    // @todo - does nothing.

    done(null);
  }

  /**
   * Disable the plugin, this is called by the plugin manager when the plugin is
   * being disabled.
   *
   * @param {Function} done The done callback.
   * @param {Error} done.err Any raised errors.
   */
  disable(done) {
    'use strict';

    // @todo - does nothing.

    done(null);
  }

}
