var mysql = require('mysql');
var config = require('../config');
//var sqlite = require('sqlite3')

//创建数据库连接池
var pool = mysql.createPool(config.db);

module.exports = pool;
