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
 * Provides the Entity class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    loader = require('nsloader'),
    BaseEntity = loader('Entity/EntityManager/BaseEntity'),
    EUnknownSchemaField = loader(
      'Entity/EntityManager/Errors/EUnknownSchemaField'
    );

var sSchema = Symbol('Entity.schema'),
    sSubtype = Symbol('Entity.subtype'),
    sFieldData = Symbol.for('Entity.fieldData');

/**
 * The entity class.
 *
 * @extends {BaseEntity}
 */
export default class Entity extends BaseEntity {

  /**
   * The entity constructor.
   *
   * @param {EntityManager} manager The entity manager.
   * @param {Schema} schema The entity schema object.
   * @param {String} [subtype] A subtype of the entity type.
   */
  constructor(manager, schema, subtype) {
    'use strict';

    super(manager);

    this[sSchema] = schema;
    this[sSubtype] = subtype;
    this[sFieldData] = {};
  }

  /**
   * @override
   */
  collectionName() {
    'use strict';

    return this[sSchema].entityCollectionName();
  }

  /**
   * Get the entity type of this entity.
   *
   * @type {String}
   */
  get type() {
    'use strict';

    return this[sSchema].machineName;
  }

  /**
   * Get the entity subtype.
   *
   * @type {String}
   */
  get subtype() {
    'use strict';

    return this[sSubtype];
  }

  /**
   * @override
   */
  _docToEntity(doc, done) {
    'use strict';

    var me = this;
    super._docToEntity(doc, function (err) {
      if (err) {
        return done(err);
      }

      var queue = [];

      function subload(field, type, machineName) {
        return function (next) {
          me.manager.load(type, machineName, function (err, entity) {
            if (err) {
              return next(err);
            }

            me[sFieldData][field] = entity;
            next();
          });
        };
      }

      me[sSubtype] = doc.subtype;
      me[sFieldData] = doc.fieldData || {};

      for (var field in me[sFieldData]) {
        if (
          me[sFieldData][field].type &&
          me[sFieldData][field].machineName
        ) {
          queue.push(subload(
            field,
            me[sFieldData][field].type,
            me[sFieldData][field].machineName
          ));
        }
      }

      async.series(queue, function (err) {
        done(err ? err : null);
      });
    });
  }

  /**
   * @override
   */
  _entityToDoc(by, done) {
    'use strict';

    var me = this;
    super._entityToDoc(by, function (err, doc) {
      if (err) {
        return done(err);
      }

      doc.type = me[sSchema].machineName;
      doc.subtype = me[sSubtype];

      doc.fieldData = {};
      for (var field in me[sFieldData]) {
        if (me[sFieldData][field] instanceof Entity) {
          doc.fieldData[field] = {
            type: me[sFieldData][field].type,
            subtype: me[sFieldData][field].subtype,
            machineName: me[sFieldData][field].machineName
          };
        } else {
          doc.fieldData[field] = me[sFieldData][field];
        }
      }

      done(null, doc);
    });
  }

  /**
   * Get a field value.
   *
   * @param {String} field The name of the field.
   * @return {Mixed} The fields value.
   * @throws {EUnknownSchemaField} If the field is not defined in the schema.
   */
  get(field) {
    'use strict';

    if (this[sSchema].hasField(field) === false) {
      throw new EUnknownSchemaField(field);
    }

    if (this[sFieldData][field] !== undefined) {
      return this[sFieldData][field];
    }

    var config = this[sSchema].getField(field);
    if (config.options['default'] !== undefined) {
      return config.options['default'];
    }

    return null;
  }

  /**
   * Sets a field value.
   *
   * @param {String} field The name of the field.
   * @param {Mixed} value The value to set the field.
   * @return {Entity} Returns self.
   * @throws {EUnknownSchemaField} If the field is not defined in the schema.
   */
  set(field, value) {
    'use strict';

    if (this[sSchema].hasField(field) === false) {
      throw new EUnknownSchemaField(field);
    }

    this[sFieldData][field] = value;
    return this;
  }

}
