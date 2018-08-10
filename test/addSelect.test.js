'use strict';

const chai = require('chai');

const expect = chai.expect;

const addSelect = require('../index').addSelect;

const databaseConfig = require('../database/knexfile');
const knex = require('knex')(databaseConfig.testing);
const Model = require('../database/Model');

Model.knex(knex);

describe('TESTING: addSelect', () => {
  it('it should return the query builder if the select is not defined', async () => {
    let result = null;

    try {
      result = addSelect(Model.query());
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(0);
  });

  it('it should add a select operation', async () => {
    let result = null;

    try {
      result = addSelect(Model.query(), 'id,column_two');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('select');
    expect(result).to.have.nested.property('_operations[0].args').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('column_two');
  });

  it('it should fail if the select is specified but is empty', async () => {
    let result = null;

    try {
      result = addSelect(Model.query(), '');
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the select is specified but is null', async () => {
    let result = null;

    try {
      result = addSelect(Model.query(), null);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the select is specified but is a number', async () => {
    let result = null;

    try {
      result = addSelect(Model.query(), 1);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the select is specified but is an array', async () => {
    let result = null;

    try {
      result = addSelect(Model.query(), [1]);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });

  it('it should fail if the select is specified but is an object', async () => {
    let result = null;

    try {
      result = addSelect(Model.query(), { test: 'test' });
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('name').equal('InvalidArgumentError');
    expect(result).to.have.property('statusCode').equal(400);
  });
});
