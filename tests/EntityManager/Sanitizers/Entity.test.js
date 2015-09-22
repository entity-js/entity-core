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

var async = require('async'),
    test = require('unit.js'),
    loader = require('nsloader'),
    Database = loader('Entity/Database'),
    Validators = loader('Entity/Validators'),
    Sanitizers = loader('Entity/Sanitizers'),
    Entity = loader('Entity/EntityManager/Entity'),
    Schema = loader('Entity/EntityManager/Schema'),
    EntityManager = loader('Entity/EntityManager'),
    EntityRule = loader('Entity/EntityManager/Sanitizers/Entity'),
    EMissingTypeConfig = loader(
      'Entity/EntityManager/Errors/EMissingTypeConfig'
    ),
    EUnexpectedFieldValue = loader(
      'Entity/EntityManager/Errors/EUnexpectedFieldValue'
    ),
    EInvalidEntityType = loader(
      'Entity/EntityManager/Errors/EInvalidEntityType'
    );

var core, schema;

describe('entity/EntityManager/Sanitizers/Entity', function () {

  'use strict';

  beforeEach(function (done) {

    core = {};
    core.database = new Database();
    core.database.connect('test', {
      name: 'test',
      host: '0.0.0.0'
    }, true);

    core.validators = new Validators(core);
    core.sanitizers = new Sanitizers(core);
    core.sanitizers.register('entity', EntityRule);

    core.entityManager = new EntityManager(core);

    schema = new Schema(core.entityManager);
    schema.machineName = 'test';
    schema
      .addField(
        'title',
        'Title',
        'A title of this entity.',
        'String',
        {
          'default': ''
        }
      )
      .addFieldSanitization('title', 'trim')
      .addField(
        'description',
        'Description',
        'A description of this entity',
        'String'
      )
      .addField('subentity', 'Sub', 'A sub entity.', 'Entity')
      .addFieldValidation('subentity', 'entity', {
        type: 'test'
      })
      .save(done);

  });

  afterEach(function (done) {

    var queue = [];

    queue.push(function (next) {
      core.database.collection('schemas', 'test').drop(function () {
        next();
      });
    });

    queue.push(function (next) {
      core.database.collection('entity-test', 'test').drop(function () {
        next();
      });
    });

    async.series(queue, function (err) {
      if (err) {
        return done(err);
      }

      core.database.disconnect('test');
      done();
    });

  });

  it('sanitizerShouldBeAvailable', function () {

    test.bool(
      core.sanitizers.registered('entity')
    ).isTrue();

  });

  it('shouldThrowMissingOption', function (done) {

    var entity = {
          type: 'test'
        };

    core.sanitizers.sanitize(function (err, orig, value) {

      test.object(
        err
      ).isInstanceOf(EMissingTypeConfig);

      done();

    }, 'entity', entity);

  });

  it('shouldThrowAnEUnexpectedFieldValue', function (done) {

    var entity = {
          type: 'test'
        };

    core.sanitizers.sanitize(function (err, orig, value) {

      test.object(
        err
      ).isInstanceOf(EUnexpectedFieldValue);

      done();

    }, 'entity', entity, {
      type: 'test'
    });

  });

  it('shouldThrowAnEInvalidEntityType', function (done) {

    var testEntity,
        queue = [];

    queue.push(function (next) {

      core.entityManager.create(function (err, entity) {

        if (err) {
          return next(err);
        }

        testEntity = entity;
        next();

      }, 'test');

    });

    queue.push(function (next) {

      core.sanitizers.sanitize(function (err, orig, value) {

        test.object(
          err
        ).isInstanceOf(EInvalidEntityType);

        next();

      }, 'entity', testEntity, {
        type: 'unknown'
      });

    });

    async.series(queue, done);

  });

  it('shouldLoadEntity', function (done) {

    var testEntity,
        queue = [];

    queue.push(function (next) {

      core.entityManager.create(function (err, entity) {

        if (err) {
          return next(err);
        }

        testEntity = entity;
        testEntity.machineName = 'test-entity';
        testEntity.save(next);

      }, 'test');

    });

    queue.push(function (next) {

      core.sanitizers.sanitize(function (err, orig, value) {

        test.value(
          err
        ).isNull();

        test.string(
          orig
        ).is('test-entity');

        test.object(value)
          .isInstanceOf(Entity)
          .hasKey('machineName', 'test-entity');

        next();

      }, 'entity', 'test-entity', {
        type: 'test'
      });

    });

    async.series(queue, done);

  });

  it('shouldAcceptTheEntity', function (done) {

    var testEntity,
        queue = [];

    queue.push(function (next) {

      core.entityManager.create(function (err, entity) {

        if (err) {
          return next(err);
        }

        testEntity = entity;
        testEntity.machineName = 'test-entity';
        testEntity.save(next);

      }, 'test');

    });

    queue.push(function (next) {

      core.sanitizers.sanitize(function (err, orig, value) {

        test.value(
          err
        ).isNull();

        test.object(value)
          .isInstanceOf(Entity)
          .is(testEntity);

        done();

      }, 'entity', testEntity, {
        type: 'test'
      });

    });

    async.series(queue, done);

  });

});
