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
 * Provides a helper object which provides some data/eval manipulation.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

/**
 * The data manipulation class.
 *
 * @class
 * @param {Object} [data={}] The data object to manipulate, if null then one is
 *   created.
 * @param {String} [sep="."] The seperator to use to seperate each xpath
 *   element.
 */
function Data(data, sep) {
  'use strict';

  var _data = data || {};

  Object.defineProperties(this, {
    /**
     * Get the internal data object.
     *
     * @var {Object} data
     * @memberof Data
     * @instance
     */
    data: {
      get: function () {
        return _data;
      },
      set: function (value) {
        _data = value;
      }
    },

    /**
     * Get the seperator that is used to seperate the elements in an xpath.
     *
     * @var {String} seperator
     * @memberof Data
     * @instance
     */
    seperator: {
      value: sep || '.'
    }
  });
}

/**
 * Helper function to convert a property name to an XPath used through eval to
 * get or set a config value.
 *
 * @param {String} name The name of the property.
 * @return {String} The name converted to an eval xpath.
 * @private
 */
Data.prototype._nameToXPath = function (name) {
  'use strict';

  return name.split(this.seperator).join('"]["');
};

/**
 * Determines if the provided property exists.
 *
 * @param {String} name The name of the property to check.
 * @return {Boolean} Returns true or false.
 */
Data.prototype.has = function (name) {
  'use strict';

  var has = false;

  /* jshint -W061 */
  /* eslint-disable */
  eval('try {\
    has = this.data["' + this._nameToXPath(name) + '"] !== undefined;\
  } catch (err) {\
    has = false;\
  }');
  /* eslint-enable */

  return has;
};

/**
 * Get the value of the property, or the default value.
 *
 * @param {String} name The name of the property to get.
 * @param {Mixed} [def=null] The default value to return if the property
 *   doesnt exist.
 * @return {Mixed} Returns the property value, otherwise the def value.
 */
Data.prototype.get = function (name, def) {
  'use strict';

  if (def === undefined) {
    def = null;
  }

  var n = this._nameToXPath(name),
      val;

  /* jshint -W061 */
  /* eslint-disable */
  eval('try {\
    val = this.data["' + n + '"] !== undefined ? \
      this.data["' + n + '"] : \
      def;\
  } catch (err) {\
    val = def;\
  }');
  /* eslint-enable */

  return val;
};

/**
 * Set the value of a property.
 *
 * @param {String} name The name of the property to set.
 * @param {Mixed} value The value to assign.
 * @returns {Data} Returns self.
 */
Data.prototype.set = function (name, value) {
  'use strict';

  var ns = name.split(this.seperator),
      xpath = '';

  for (var i = 0, len = ns.length - 1; i < len; i++) {
    xpath += (i > 0 ? '"]["' : '') + ns[i];

    /* jshint -W061 */
    /* eslint-disable */
    eval('if (this.data["' + xpath + '"] === undefined) {\
      this.data["' + xpath + '"] = {};\
    }');
    /* eslint-enable */
  }

  /* jshint -W061 */
  /* eslint-disable */
  eval('this.data["' + this._nameToXPath(name) + '"] = value;');
  /* eslint-enable */

  return this;
};

/**
 * Deletes the value of a property.
 *
 * @param {String} name The name of the property to delete.
 * @returns {Data} Returns self.
 */
Data.prototype.del = function (name) {
  'use strict';

  /* jshint -W061 */
  /* eslint-disable */
  eval('delete this.data["' + this._nameToXPath(name) + '"];');
  /* eslint-enable */

  return this;
};

/**
 * Export the Data class.
 */
module.exports = Data;
