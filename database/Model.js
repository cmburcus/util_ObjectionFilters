'use strict';

const ObjectionModel = require('objection').Model;

const Model = class Model extends ObjectionModel {
  static get tableName() {
    return 'test';
  }
};

module.exports = Model;
