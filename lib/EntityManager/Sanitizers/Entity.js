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
 * The entity sanitizer rule.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var loader = require('nsloader'),
    Entity = loader('Entity/EntityManager/Entity'),
    EMissingTypeConfig = loader(
      'Entity/EntityManager/Errors/EMissingTypeConfig'
    ),
    EUnexpectedFieldValue = loader(
      'Entity/EntityManager/Errors/EUnexpectedFieldValue'
    ),
    EInvalidEntityType = loader(
      'Entity/EntityManager/Errors/EInvalidEntityType'
    );

/**
 * Entity sanitizer.
 *
 * @param {Mixed} orig The original value.
 * @param {Mixed} value The value to santiize.
 * @param {Object} options The options passed to the sanitizer.
 * @param {Function} next The next callback.
 * @param {Error} next.err Any raised errors.
 * @throws {EInvalidValue} Thrown if the value is not a string.
 */
module.exports = function sanitizeEntity (orig, value, options, next) {
  'use strict';

  if (value instanceof Entity === false && typeof value !== 'string') {
    return next(new EUnexpectedFieldValue());
  }

  if (value instanceof Entity) {
    if (options.type && value.type() !== options.type) {
      return next(new EInvalidEntityType(options.type, value.type()));
    } else {
      return next(null, value);
    }
  }

  this.core.entityManager.load(
    value.type,
    value.machineName,
    function (err, entity) {
      if (err) {
        return next(err);
      }

      next(null, entity);
    }
  );
};
