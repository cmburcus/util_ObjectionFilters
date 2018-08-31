'use strict';

const chai = require('chai');

const expect = chai.expect;

const addFilter = require('../index').addFilter;

const databaseConfig = require('../database/knexfile');
const knex = require('knex')(databaseConfig.testing);
const Model = require('../database/Model');

Model.knex(knex);

describe('TESTING: addFilter', () => {
  it('it should return the query builder if the filter is not defined', () => {
    let result = null;

    try {
      result = addFilter(Model.query());
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(0);
  });

  it('it should fail if filter is not valid JSON', async () => {
    let result = null;

    const filter = "[column:'id'}";

    try {
      result = addFilter(Model.query(), filter);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter');
  });

  it('it should fail if filter is specified but is null', async () => {
    let result = null;

    try {
      result = addFilter(Model.query(), null);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter');
  });

  it('it should fail if filter is specified but is a number', async () => {
    let result = null;

    try {
      result = addFilter(Model.query(), 1);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter');
  });

  it('it should fail if filter is specified but is an array', async () => {
    let result = null;

    try {
      result = addFilter(Model.query(), [1]);
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter');
  });

  it('it should fail if filter is specified but is an object', async () => {
    let result = null;

    try {
      result = addFilter(Model.query(), { test: 'test' });
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter');
  });

  it('it should fail if filter is not a json array', async () => {
    let result = null;

    const filter = {
      column: 'id',
      value: 1,
    };

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter');
  });

  it('it should add filter operation as equals if filter is specified but no operator is passed', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('number').and.equal(1);
  });

  it('it should add filter operation using the gt operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'gt',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('>');
    expect(result).to.have.nested.property('_operations[0].args[2]').be.a('number').and.equal(1);
  });

  it('it should add filter using the gte operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'gte',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('>=');
    expect(result).to.have.nested.property('_operations[0].args[2]').be.a('number').and.equal(1);
  });

  it('it should add filter using the lt operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'lt',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('<');
    expect(result).to.have.nested.property('_operations[0].args[2]').be.a('number').and.equal(1);
  });

  it('it should add filter using the lte operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'lte',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('<=');
    expect(result).to.have.nested.property('_operations[0].args[2]').be.a('number').and.equal(1);
  });

  it('it should add filter using the ne operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'ne',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('!=');
    expect(result).to.have.nested.property('_operations[0].args[2]').be.a('number').and.equal(1);
  });

  it('it should add filter using the eq operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'eq',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('=');
    expect(result).to.have.nested.property('_operations[0].args[2]').be.a('number').and.equal(1);
  });

  it('it should add filter using the like operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'like',
        value: 'my value',
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].args[0]._sql').be.a('string').and.equal('LOWER(id)');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('like');
    expect(result).to.have.nested.property('_operations[0].args[2]').be.a('string').and.equal('my value');
  });

  it('it should fail if an invalid operator is specified', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'invalid',
        value: 'my value',
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter[0].operator');
  });

  it('it should fail if attempting like on a non string column', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        operator: 'like',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter[0].value');
  });

  it('it should allow for multiple filters to be specified', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
        value: 'my value',
      },
      {
        column: 'column_two',
        operator: 'like',
        value: 'myva%',
      },
      {
        column: 'id',
        operator: 'gte',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('my value');

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].args[0]._sql').be.a('string').and.equal('LOWER(column_two)');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.a('string').and.equal('like');
    expect(result).to.have.nested.property('_operations[1].args[2]').be.a('string').and.equal('myva%');

    expect(result).to.have.nested.property('_operations[2]').be.an('object');
    expect(result).to.have.nested.property('_operations[2].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[2].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[2].args[1]').be.a('string').and.equal('>=');
    expect(result).to.have.nested.property('_operations[2].args[2]').be.a('number').and.equal(1);
  });

  it('it should fail if column is not specified', async () => {
    let result = null;

    const filter = [
      {
        operator: 'eq',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter[0].column');
  });

  it('it should fail if value is not specified', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter[0].value');
  });

  it('it should allow "and" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
        value: 'my value',
      },
      {
        condition: 'and',
        column: 'id',
        operator: 'eq',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('my value');

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('andWhere');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.a('string').and.equal('=');
    expect(result).to.have.nested.property('_operations[1].args[2]').be.a('number').and.equal(1);
  });

  it('it should allow "and" condition with no operator', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
        value: 'my value',
      },
      {
        condition: 'and',
        column: 'id',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('my value');

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('andWhere');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.a('number').and.equal(1);
  });

  it('it should allow "or" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
        value: 'my value',
      },
      {
        condition: 'or',
        column: 'id',
        operator: 'eq',
        value: 1,
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('my value');

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('orWhere');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.a('string').and.equal('=');
    expect(result).to.have.nested.property('_operations[1].args[2]').be.a('number').and.equal(1);
  });

  it('it should allow "in" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        range: 'in',
        value: [1,2,3],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('whereIn');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[0].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[0].args[1][1]').be.a('number').and.equal(2);
    expect(result).to.have.nested.property('_operations[0].args[1][2]').be.a('number').and.equal(3);
  });

  it('it should fail if value is not an array for "in"', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        range: 'in',
        value: { asd: 'something that is not an array' },
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('error');
    expect(result).to.have.property('type').equal('InvalidArgumentError');
    expect(result).to.have.property('status').equal(400);
    expect(result).to.have.property('error').equal('filter[0].value');
  });

  it('it should allow "orIn" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
        value: 'my value',
      },
      {
        column: 'id',
        range: 'orIn',
        value: [1,2,3],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('my value');

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('orWhereIn');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[1].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[1].args[1][1]').be.a('number').and.equal(2);
    expect(result).to.have.nested.property('_operations[1].args[1][2]').be.a('number').and.equal(3);
  });

  it('it should allow "notIn" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        range: 'notIn',
        value: [1,2,3],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('whereNotIn');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[0].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[0].args[1][1]').be.a('number').and.equal(2);
    expect(result).to.have.nested.property('_operations[0].args[1][2]').be.a('number').and.equal(3);
  });

  it('it should allow "orNotIn" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
        value: 'my value',
      },
      {
        column: 'id',
        range: 'orNotIn',
        value: [1,2,3],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('my value');

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('orWhereNotIn');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.an('array').and.have.lengthOf(3);
    expect(result).to.have.nested.property('_operations[1].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[1].args[1][1]').be.a('number').and.equal(2);
    expect(result).to.have.nested.property('_operations[1].args[1][2]').be.a('number').and.equal(3);
  });

  it('it should allow "between" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        range: 'between',
        value: [1, 5],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('whereBetween');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[0].args[1][1]').be.a('number').and.equal(5);
  });

  it('it should allow "orBetween" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        value: 1,
      },
      {
        column: 'id',
        range: 'orBetween',
        value: [1, 5],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('number').and.equal(1);

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('orWhereBetween');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[1].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[1].args[1][1]').be.a('number').and.equal(5);
  });

  it('it should allow "notBetween" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'id',
        range: 'notBetween',
        value: [1, 5],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(1);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('whereNotBetween');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[0].args[1][1]').be.a('number').and.equal(5);
  });

  it('it should allow "orNotBetween" condition', async () => {
    let result = null;

    const filter = [
      {
        column: 'column_one',
        value: 'my value',
      },
      {
        column: 'id',
        range: 'orNotBetween',
        value: [1, 5],
      },
    ];

    try {
      result = addFilter(Model.query(), JSON.stringify(filter));
    } catch (error) {
      result = error;
    }

    expect(result).to.be.an('object');
    expect(result).to.have.property('_operations').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[0]').be.an('object');
    expect(result).to.have.nested.property('_operations[0].name').be.a('string').and.equal('where');
    expect(result).to.have.nested.property('_operations[0].args[0]').be.a('string').and.equal('column_one');
    expect(result).to.have.nested.property('_operations[0].args[1]').be.a('string').and.equal('my value');

    expect(result).to.have.nested.property('_operations[1]').be.an('object');
    expect(result).to.have.nested.property('_operations[1].name').be.a('string').and.equal('orWhereNotBetween');
    expect(result).to.have.nested.property('_operations[1].args[0]').be.a('string').and.equal('id');
    expect(result).to.have.nested.property('_operations[1].args[1]').be.an('array').and.have.lengthOf(2);
    expect(result).to.have.nested.property('_operations[1].args[1][0]').be.a('number').and.equal(1);
    expect(result).to.have.nested.property('_operations[1].args[1][1]').be.a('number').and.equal(5);
  });
});
