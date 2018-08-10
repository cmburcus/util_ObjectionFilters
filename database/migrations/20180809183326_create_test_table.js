'use strict';

const TABLE_NAME = 'test';

module.exports = {
  up: (knex) =>
    knex.schema.createTable(TABLE_NAME, (table) => {
      table
        .increments('id')
        .unsigned()
        .primary()
        .notNull();

      table.string('column_one');
      table.string('column_two');
    }),

  down: (knex) => knex.schema.dropTable(TABLE_NAME),
};
