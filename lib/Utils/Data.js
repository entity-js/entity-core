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

var sData = Symbol('Data.data'),
    sSep = Symbol('Data.sep');

/**
 * The data manipulation class.
 */
export default class Data {

  /**
   * Construct the data object.
   *
   * @param {Object} [data=null] The data object to manipulate, if null then one
   *   is created.
   * @param {String} [sep="."] The seperator to use to seperate each xpath
   *   element.
   */
  constructor(data, sep) {
    'use strict';

    this[sData] = data || {};
    this[sSep] = sep || '.';
  }

  /**
   * Get the internal data object.
   *
   * @type {Object}
   */
  get data() {
    'use strict';

    return this[sData];
  }

  /**
   * Set the internal data object.
   *
   * @type {Object}
   */
  set data(data) {
    'use strict';

    this[sData] = data;
  }

  /**
   * Get the seperator that is used to seperate the elements in an xpath.
   *
   * @type {String}
   */
  get seperator() {
    'use strict';

    return this[sSep];
  }

  /**
   * Helper function to convert a property name to an XPath used through eval to
   * get or set a config value.
   *
   * @param {String} name The name of the property.
   * @return {String} The name converted to an eval xpath.
   * @private
   */
  _nameToXPath(name) {
    'use strict';

    return name.split(this[sSep]).join('"]["');
  }

  /**
   * Determines if the provided property exists.
   *
   * @param {String} name The name of the property to check.
   * @return {Boolean} Returns true or false.
   */
  has(name) {
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
  }

  /**
   * Get the value of the property, or the default value.
   *
   * @param {String} name The name of the property to get.
   * @param {Mixed} [def=null] The default value to return if the property
   *   doesnt exist.
   * @return {Mixed} Returns the property value, otherwise the def value.
   */
  get(name, def) {
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
  }

  /**
   * Set the value of a property.
   *
   * @param {String} name The name of the property to set.
   * @param {Mixed} value The value to assign.
   * @returns {Data} Returns self.
   */
  set(name, value) {
    'use strict';

    var ns = name.split(this[sSep]),
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
  }

  /**
   * Deletes the value of a property.
   *
   * @param {String} name The name of the property to delete.
   * @returns {Data} Returns self.
   */
  del(name) {
    'use strict';

    /* jshint -W061 */
    /* eslint-disable */
    eval('delete this.data["' + this._nameToXPath(name) + '"];');
    /* eslint-enable */

    return this;
  }

}
