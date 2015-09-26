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
 * The entity core component.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    async = require('async'),
    loader = require('nsloader'),
    Config = loader('Entity/Utils/Config'),
    EntityEvents = loader('Entity/Events');

/**
 * The core Entity class.
 *
 * @class
 * @param {String} filename The filename of the config file to load.
 * @param {Boolean} [cli=false] Set to true if running in CLI mode.
 */
function EntityCore(filename, cli) {
  'use strict';

  var isInitialized = false,
      isCli = cli === true;

  Object.defineProperties(this, {
    /**
     * Determine if the core has been initialized.
     *
     * @var {Boolean} _isInitialized
     * @default false
     * @memberof EntityCore
     * @private
     * @instance
     */
    _isInitialized: {
      get: function () {
        return isInitialized;
      },
      set: function (value) {
        isInitialized = value === true;
      }
    },
    /**
     * Determine if the core has been initialized.
     *
     * @var {Boolean} isInitialized
     * @default false
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    isInitialized: {
      get: function () {
        return isInitialized;
      }
    },
    /**
     * Determine if we are running in CLI mode.
     *
     * @var {Boolean} isCli
     * @default false
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    isCli: {
      value: isCli
    },
    /**
     * Get the config object.
     *
     * @var {Config} config
     * @memberof EntityCore
     * @readonly
     * @instance
     */
    config: {
      value: new Config(this, filename)
    }
  });
}

/**
 * Initializes the core application.
 *
 * @param {Function} done The done callback.
 *   @param {Error} done.err Any errors raised.
 */
EntityCore.prototype.initialize = function (done) {
  'use strict';

  var me = this,
      queue = [];

  queue.push(function (next) {
    me.config.load(next);
  });

  queue.push(function (next) {
    me.fire(next, 'core.pre-init', {
      core: me
    });
    // @todo - database
    // @todo - me.locale.initialize(me.config.get('locale.dir'), next);
  });

  queue.push(function (next) {
    me.fire(next, 'core.init', {
      core: me
    });

    // @todo - setup cli commands.
  });

  queue.push(function (next) {
    me.fire(next, 'core.post-init', {
      core: me
    });
  });

  async.series(queue, function (err) {
    if (!err) {
      me._isInitialized = true;
    }

    me.fire(done, 'core.ready', {
      core: me
    });
  });
};

util.inherits(EntityCore, EntityEvents);

/**
 * Exports the EntityCore class.
 */
module.exports = EntityCore;
