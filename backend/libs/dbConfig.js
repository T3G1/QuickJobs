"use strict";

var config = {
    connectionLimit : 10,
    host            : process.env.MYSQL_HOST || '127.0.0.1',
    user            : process.env.MYSQL_USER || 'root',
    password        : process.env.MYSQL_PASSWORD || '123qweasdzxc',
    database        : process.env.DB_NAME || 'quickjobs'
};

module.exports = config;
