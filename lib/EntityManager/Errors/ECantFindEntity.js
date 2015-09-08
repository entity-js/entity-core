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
 * Provides the ECantFindEntity error which is used when attempting to load an
 * entity which doesnt exist.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    EError = loader('Entity/EError');

var sCollection = Symbol('ECantFindEntity.collection'),
    sMachineName = Symbol('ECantFindEntity.machineName');

/**
 * Thrown when loading an entity which doesnt exist.
 *
 * @extends {EError}
 */
export default class ECantFindEntity extends EError {

  /**
   * The error constructor.
   *
   * @param {String} collection The collection name.
   * @param {String} machineName The machine name being used.
   */
  constructor(collection, machineName) {
    'use strict';

    super();
    this[sCollection] = collection;
    this[sMachineName] = machineName;
  }

  /**
   * The collection name of the entity.
   *
   * @type {String}
   */
  get collection() {
    'use strict';

    return this[sCollection];
  }

  /**
   * The machine name used to attempt to load with.
   *
   * @type {String}
   */
  get machineName() {
    'use strict';

    return this[sMachineName];
  }

}
