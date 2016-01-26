var Sequelize = require('sequelize');
var config=require('../config')
var db=config.db;
var sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  //port: '3306',
  // pool:{
  //   max:,
  //   min,
  //   idle:
  // },
  dialect: 'mysql'

});
module.exports=sequelize;
