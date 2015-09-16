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

/**
 * The plugin base class.
 *
 * @class {Plugin}
 * @param {PluginManager} manager The plugin manager.
 * @param {String} name The name of the plugin.
 * @param {Object} info The info object for the plugin.
 */
function Plugin (manager, name, info) {
  'use strict';

  /**
   * The plugin manager.
   *
   * @type {PluginManager}
   */
  Object.defineProperty(this, 'manager', {
    value: manager
  });

  /**
   * The name of the plugin.
   *
   * @type {String}
   */
  Object.defineProperty(this, 'name', {
    value: name
  });

  /**
   * The plugin info object.
   *
   * @type {Object}
   */
  Object.defineProperty(this, 'info', {
    value: info
  });
}

/**
 * Boot the plugin, this is called by the plugin manager when the plugin is
 * booting. This will run when enabling everytime.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 */
Plugin.prototype.boot = function (done) {
  'use strict';

  // @todo - does nothing.

  done(null);
};

/**
 * Enabling the plugin, this is called by the plugin manager when the plugin
 * has been enabled for the first time the plugin is enabled or after being
 * disabled.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 */
Plugin.prototype.enable = function (done) {
  'use strict';

  // @todo - does nothing.

  done(null);
};

/**
 * Disable the plugin, this is called by the plugin manager when the plugin is
 * being disabled.
 *
 * @param {Function} done The done callback.
 * @param {Error} done.err Any raised errors.
 */
Plugin.prototype.disable = function (done) {
  'use strict';

  // @todo - does nothing.

  done(null);
};

/**
 * Exports the Plugin class.
 */
module.exports = Plugin;
