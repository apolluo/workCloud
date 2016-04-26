wc.extend({
  cmd: function(command, callback, log) {
    console.log('cmd:' + command)
    if (log) {
      wc.log({
        state: 'start',
        txt: 'cmd:' + command
      })
    } else {
      bootbox.loading('加载中，请稍候...')
    }

    //var exec = require('child_process').exec;
    // exec(command,{
    //   encoding: 'utf8',
    // timeout: 1000*30, /*子进程最长执行时间 */
    // maxBuffer: 2000*1024,  /*stdout和stderr的最大长度*/
    // killSignal: 'SIGTERM',
    // cwd: null,
    // env: null
    // }, function(err, stdout, stderr){
    //   if (err) {
    //     console.log('error:' + stderr);
    //   } else {
    //     console.log(stdout);
    //     //var data = JSON.parse(stdout);
    //   }
    //   if(callback){
    //     callback(err, stdout, stderr)
    //   }
    //
    // });
    if (!command) {
      return Promise.reject();
    } else if ($.isArray(command)) { //按先后顺序
      return command.reduce(function(prefCommand, currentCommand) {
        console.log(prefCommand, currentCommand)
        return wc.cmd(prefCommand)
          .then(function() {
            console.log('prefCommand ok then')
            return wc.cmd(currentCommand)
          })
          //return prefCommand.then(currentCommand)
      });

    } else if ($.isPlainObject(command)) { //无先后顺序
      var allPromis = []
      $.each(command, function(k, v) {
        allPromis.push(wc.cmd(v));
      });
      return Promise.all(allPromis);
    } else {
      var _promise = new Promise(function(resolve, reject) {

        var exec = require('child_process').exec;
        var child = exec(command, {
          encoding: 'utf-8'
        });
        // var iconv = require('iconv-lite');
        // var Buffer = require('bufferhelper');
        var _data = [];
        var _error = []
          //var buffer
        console.log('promise on 监听data事件')
          //child.stdout.setEncoding('utf-8')
        child.stdout.on('data', function(data) {
          //  buffer = new Buffer(data);
          // var str = iconv.decode(buffer, 'gbk');
          console.log('stdout: ' + data);
          if (log)
            wc.log({
              state: 'loading',
              txt: data
            })
          _data.push(data);
          var code = data.code || data
          switch (code) {
            case 'error':
              console.log('执行失败')
              if (log)
                wc.log({
                  state: 'loading',
                  txt: '执行失败'
                })
              reject();
              break;
            case 'ok':
              console.log('执行成功')
              if (log)
                wc.log({
                  state: 'loading',
                  txt: '执行成功'
                })
              resolve();
              break;
          }
        });
        child.stdout.on('end', function(data) {
          // var buffer = new Buffer(data);
          // var str = iconv.decode(buffer.toBuffer(),'gbk');
          console.log('stdend: ' + data);
          if (log) {
            wc.log({
              state: 'loading',
              txt: '---------------'
            })
          } else {
            bootbox.hideAll();
          }

          //reject();
        });
        child.stderr.on('data', function(data) {
          // buffer = new Buffer(data);
          // var str = iconv.decode(buffer.toBuffer(),'gbk');
          _error.push(data)
          console.log('stderr: ' + data);
          if (log)
            wc.log({
              state: 'loading',
              txt: data
            })
            //reject();
        });
        child.on('close', function(code) {
          if (callback) {
            callback()
          }
          console.log('closing code: ' + code);
          console.log('执行成功')
          if (log)
            wc.log({
              state: 'loading',
              txt: '执行结束'
            })
            //wc.log({state:'end'})
          resolve(_data);
        });
      })
      return _promise;
    }

  },
  buildJs: function(config) {
    console.log('编译js:')
      //wc.log({state:'start',txt:'编译js:'})
    switch (config.type) {
      case 'cmd':
        this.cmd(config.cmdStr, null, true)
          // var exec = require('child_process').exec;
          // exec(config.cmdStr, function(err, stdout, stderr) {
          //   if (err) {
          //     console.log('error:' + stderr);
          //   } else {
          //     console.log(stdout);
          //     //var data = JSON.parse(stdout);
          //
          //   }
          // });
        break;
      case 'gulp':
        console.log('gulp')
        var _config = {
          //要编译的项目目录
          path: config.path,
          //要编译的文件
          //src: '*_temp.js',['js/**/*.js', '!js/**/*.min.js'],
          src: config.src,
          //type:'concat/temp',
          type: config.type,
          debug:{
            path:config.debugPath,
            name:config.debugName
          },
          release:{
            path:config.releasePath,
            name:config.releaseName
          }
            // ,
            // compress: {
            //   //it can't be array,why?
            //   pure_funcs: 'console.log, b , alert',
            //   "unused": true,
            //   "dead_code": true,
            //   "global_defs": {
            //     "DEBUG": false,
            //     "DIA_VERSION": '0.1.0'
            //   }
            // }
        }
        if (wc.gulp) {
          wc.gulp(config.configFile,true);
        } else {
          $.getScript('./plugin/wc_gulp.js')
            .done(function(data, state) {
              //console.log(xhr)
              console.log(state)
              wc.gulp(config.configFile,true);
            })
            .fail(function(jqxhr, settings, exception) {
              console.log(jqxhr, settings, exception);
            });
        }
        break;
      default:
        break;
    }
  }
})
