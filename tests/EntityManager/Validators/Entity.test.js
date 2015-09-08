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

var test = require('unit.js'),
    loader = require('nsloader'),
    Validators = loader('Entity/Validators'),
    Entity = loader('Entity/EntityManager/Entity'),
    EntityRule = loader('Entity/EntityManager/Validators/Entity'),
    EInvalidEntity = loader('Entity/EntityManager/Errors/EInvalidEntity'),
    EFailedEntity = loader('Entity/EntityManager/Errors/EFailedEntity');

class TestEntity extends Entity {

  constructor(type) {
    super(null);
    this._type = type || 'test';
  }

  get type() {
    return this._type;
  }

}

function createValidator() {
  'use strict';

  var validators = new Validators();
  validators.register('entity', EntityRule);

  return validators;
}

describe('entity/EntityManager/Validators/Entity', function () {

  'use strict';

  it('validatorShouldBeAvailable', function () {

    var validators = createValidator();

    test.bool(
      validators.registered('entity')
    ).isTrue();

  });

  it('shouldThrowAnInvalidEntity', function (done) {

    var validators = createValidator(),
        entity = {
          type: 'test'
        };

    validators.validate(function (err) {

      test.object(
        err
      ).isInstanceOf(EInvalidEntity);

      done();

    }, 'entity', entity, {
      type: 'test'
    });

  });

  it('shouldThrowFailedEntityError', function (done) {

    var validators = createValidator(),
        entity = new TestEntity('foo');

    validators.validate(function (err) {

      test.object(
        err
      ).isInstanceOf(EFailedEntity);

      done();

    }, 'entity', entity, {
      type: 'test'
    });

  });

  it('shouldValidateAsValid', function (done) {

    var validators = createValidator(),
        entity = new TestEntity();

    validators.validate(function (err) {

      test.value(
        err
      ).isNull();

      done();

    }, 'entity', entity);

  });

  it('shouldValidateAsValidWithEntityType', function (done) {

    var validators = createValidator(),
        entity = new TestEntity();

    validators.validate(function (err) {

      test.value(
        err
      ).isNull();

      done();

    }, 'entity', entity, {
      type: 'test'
    });

  });

});