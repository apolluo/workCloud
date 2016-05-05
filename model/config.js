var db = require('./db');
var Sequelize = require('sequelize');
//实例
var sequelize = require('./sequelize')

var Config = sequelize.define('Config', {
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  configFile: Sequelize.TEXT,
  cmdStr: Sequelize.TEXT,
  info: Sequelize.TEXT,
  prj: Sequelize.STRING
}, {
  //表名不指定，默认生成后似乎不好修改
  tableName: 'config'
})
Config.sync(
  //删掉重建
  //{ force: true }
).then(function() {
  console.log('配置同步成功')
}).catch(function() {
  console.log('配置同步失败')
})
Config.getConfig = function(prj, callback) {
  Config.findAll({
    where: {
      prj: prj
    }

  }).then(
    function(config) {
      console.log('获取配置', prj, config)
      callback("success", config);
    }
  )
  Config.modify = function(data, callback) {
    Config.update({
      name: data[0],
      type: data[1],
      configFile: data[2],
      cmdStr: data[3],
      info: data[4],
      prj: data[5]
    }, {
      where: {
        id: data[6]
      }
    }).then(
      function(config) {
        console.log(callback)
        console.log(config)
        callback('update success', config)
      })
  }
  Config.save = function(data, callback) {
    Config.create({
      name: data[0],
      type: data[1],
      configFile: data[2],
      cmdStr: data[3],
      info: data[4],
      prj: data[5]
    }).then(
      function(config) {
        callback('success', config.toJSON())
      }
    )
  }
  Config.delete = function(option, callback) {
    console.log(option)
    Config.destroy({
        where: (typeof option == 'object' ? option : {
          'id': option
        })
      }).then(function(config) {
        console.log(config)
        callback('success', config)
      })
      .catch(function(err) {
        console.log(err)
      })
  }
}
module.exports = Config;


/**
 * 查询所有项目
 * Callback:
 * - err, 数据库错误
 * @param {Function} callback 回调函数
 */
// Config.getConfig = function(id, callback) {
//
//   //从连接池中获取一个连接
//   db.getConnection(function(err, connection) {
//     var sqlStr = "select * from config where pid=?"
//     var sql = connection.format(sqlStr, [id])
//     connection.query(sql, function(err, config) {
//       if (err) {
//         callback(err, null);
//       }
//
//       callback("success", config);
//
//       connection.release(); //使用完之后断开连接，放回连接池
//     });
//   });
// };
// Config.save = function(callback) {
//
// }
