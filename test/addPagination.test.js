'use strict';

const chai = require('chai');

const expect = chai.expect;

const addPagination = require('../index').addPagination;

const databaseConfig = require('../database/knexfile');
const knex = require('knex')(databaseConfig.testing);
const Model = require('../database/Model');

Model.knex(knex);

describe('TESTING: addPagination', () => {
  it('it should paginate the operation if params are numbers', async () => {
    let result = null;

    try {
      result = addPagination(Model.query(), 1, 50);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.an('string').and.equal('limit');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('number').and.equal(50);
    expect(result).to.have.nested.property('_operations[1].name').be.an('string').and.equal('offset');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('number').and.equal(0);
  });

  it('it should paginate the operation if params are strings', async () => {
    let result = null;

    try {
      result = addPagination(Model.query(), '1', '50');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.an('string').and.equal('limit');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('number').and.equal(50);
    expect(result).to.have.nested.property('_operations[1].name').be.an('string').and.equal('offset');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('number').and.equal(0);
  });

  it('it should allow to get different pages', async () => {
    let result = null;

    try {
      result = addPagination(Model.query(), '5', '50');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.an('string').and.equal('limit');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('number').and.equal(50);
    expect(result).to.have.nested.property('_operations[1].name').be.an('string').and.equal('offset');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('number').and.equal(200);
  });

  it('it should fail if page is defined but pageSize is not', async () => {
    let result = null;

    try {
      result = addPagination(Model.query(), 1);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if page or pageSize are specified but are null', async () => {
    let result = null;

    try {
      result = addPagination(Model.query(), null, null);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if page or pageSize are specified but are arrays', async () => {
    let result = null;

    try {
      result = addPagination(Model.query(), [1], [1]);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if page or pageSize are specified but are objects', async () => {
    let result = null;

    try {
      result = addPagination(Model.query(), { test: 'test' }, { test: 'test' });
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });
});
