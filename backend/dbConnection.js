"use strict";

var mysql = require('mysql');

var config = require('./libs/dbConfig');

var pool  = mysql.createPool(config);

module.exports = pool;