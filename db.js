'use strict';

/* DB access module */
const mySql = require('mysql');

const connection = mySql.createConnection({
  host     : 'sql11.freemysqlhosting.net',
  user     : 'sql11469906',
  password : 'ZLFq3P8qhx',
  database: 'sql11469906'
});

module.exports = connection;
