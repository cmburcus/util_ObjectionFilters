'use strict';

module.exports = {
  testing: {
    client: 'sqlite3',
    connection: {
      filename: "../../database/testdb.sqlite", // Mounted on the docker image
    },
    useNullAsDefault: true,
  },
};
