//var db = require('./db');
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

var mysql = require('mysql');
var config = require('../config');
//var sqlite = require('sqlite3')

//创建数据库连接池
var pool = mysql.createPool(config.db);

module.exports = pool;

//var db = require('./db');
var Sequelize = require('sequelize');
var sequelize = require('./sequelize')
var Projs = {};



Projs = sequelize.define('Projs', {
    // auto increment, primaryKey, unique
    // id: {
    //   //整型
    //   type: Sequelize.INTEGER,
    //   //自动增长
    //   autoIncrement: true,
    //   //主键
    //   primaryKey: true,
    //   //唯一
    //   unique: true
    // },

    //项目名
    name: {
      // VARCHAR(255)
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      comment: '项目名'
    },

    //项目路径
    src: {
      type: Sequelize.TEXT
    },

    //项目说明
    info: {
      type: Sequelize.TEXT,
      //允许空
      allowNull: true
    },

    //配置
    config: {
      type: Sequelize.TEXT,
      //默认值
      defaultValue: ''
    },

    //创建时间
    createTime: {
      type: Sequelize.DATE,
      //默认值
      defaultValue: Sequelize.NOW
    }
  }, {
    //表名不指定，默认生成后似乎不好修改
    tableName: 'projs'
  })
  //sequelize.authenticate();

Projs.sync().then(function() {
  console.log('项目同步成功');
  // Projs.findAll().then(function(data) {
  //     console.log(data)
  //   })
  // Projs.getAllProjs=function(prj_src, callback) {
  //   Projs.findAll({src:prj_src}).then(
  //     function(projs){
  //       callback(null, projs);
  //     }
  //   )
  // }

}).catch(function(error) {
  console.log(error)
  console.log('同步项目失败');
})
Projs.getProj = function(name, callback) {
  if (name) {
    Projs.findOne(
      {
        where:{
          name: name
        }
      }
      ).then(function(projs) {

        callback('success', projs);
      })
      .catch(function(error) {
        callback('fail', error)
      })
  } else {
    Projs.findAll()
      .then(function(projs) {
        console.log('-----------------findAll success')
        console.log(projs)
        callback('success', projs);
      }).catch(function(error) {
        callback('fail', error)
      })
  }

}
Projs.save = function(data, callback) {
  Projs.create({
      name: data[0],
      src: data[1],
      info: data[2]
    }).then(function(projs) {
      callback('success', projs);
    })
    .catch(function(error) {
      callback('fail', error)
    })
}
Projs.modify = function(data, callback) {
  Projs.update({
      name: data[0],
      src: data[1],
      info: data[2]
    }, {
      where: {
        name: data[3]
      }
    }).then(function(projs) {
      callback('success', projs);
    })
    .catch(function(error) {
      callback('fail', error)
    })
}
Projs.delete = function(name, callback) {
  console.log(name)
  Projs.destroy({
      where: {
        'name': name
      }
    })
    .then(function(data) {
      callback(data)
    })
    .catch(function(err) {
      console.log(err)
    })
}

module.exports = Projs;
//Task.sync()返回promise，没有on方法
//   console.log(Task.sync().on)
// 	Task.sync().on('success', function(){
//     console.log('aa..');
// }).on('failure', function(){
//     console.log('bb..');
// });
/**
 * 查询所有项目
 * Callback:
 * - err, 数据库错误
 * @param {Function} callback 回调函数
 */
// Projs.getProj = function(prj_src, callback) {
//
//   //从连接池中获取一个连接
//   db.getConnection(function(err, connection) {
//     var sqlStr = 'select * from proj where src=?'
//     var sql = connection.format(sqlStr, prj_src)
//       //查询
//     connection.query(sql, function(err, projs) {
//       if (err) {
//         callback(err, null);
//       }
//
//       callback(null, projs);
//
//       connection.release(); //使用完之后断开连接，放回连接池
//     });
//   });
// };
// Projs.save = function(data, callback) {
//   db.getConnection(function(err, connection) {
//     var sqlStr = 'insert into proj(name,src,info) values(?,?,?)'
//     var sql = connection.format(sqlStr, data)
//     connection.query(sql, function(err, projs) {
//       if (err) {
//         callback(err, null);
//       } else {
//         callback(null, projs);
//       }
//
//
//
//       connection.release(); //使用完之后断开连接，放回连接池
//     });
//   });
// }

var Sequelize = require('sequelize');
var config = require('../config')
var db = config.db;
var sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  //port: '3306',
  // pool:{
  //   max:,
  //   min,
  //   idle:
  // },
  dialect: 'mysql',
  //dialect: 'sqlite',
  storage: 'data/workCloud.db'

});
module.exports = sequelize;
