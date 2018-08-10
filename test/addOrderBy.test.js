'use strict';

const chai = require('chai');

const expect = chai.expect;

const addOrderBy = require('../index').addOrderBy;

const databaseConfig = require('../database/knexfile');
const knex = require('knex')(databaseConfig.testing);
const Model = require('../database/Model');

Model.knex(knex);

describe('TESTING: addOrderBy', () => {
  it('it should return the query builder if the order is not defined', () => {
    let result = null;

    try {
      result = addOrderBy(Model.query());
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(0);
  });

  it('it should add ASC by default', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), 'column_one');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('orderBy');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('ASC');
  });

  it('it should order the results in ASC if the order parameter is specified as ASC', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), 'column_one,ASC');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('orderBy');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('ASC');
  });

  it('it should order the results in DESC if the order parameter is specified as DESC', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), 'column_one,DESC');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('orderBy');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('DESC');
  });

  it('it should fail if the order direction is not a valid value', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), 'column_one,UNKNOWN');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the order is specified but is empty', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), '');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the order is specified but is null', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), null);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the order is specified but is a number', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), 1);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the order is specified but is an array', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), [1]);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the order is specified but is an object', async () => {
    let result = null;

    try {
      result = addOrderBy(Model.query(), { test: 'test' });
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });
});
