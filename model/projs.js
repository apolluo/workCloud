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
