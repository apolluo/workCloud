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
    console.log('编译js:', config)
    var buildJsByConfig = function(config) {
      if ('cmd' == config.type) {
        return this.cmd(config.cmdStr, null, true);
      }
      if (config.plugin) {
        var loadPlugin = require('./plugin/node_modules/wc-plugin');
        var plugin = loadPlugin(config.plugin)
          //The plugin hasn't been install.
        if (plugin.install) {
          //var pkg=require(config.path+'package.json');
          plugin.install(config.path + config.plugin)
        } else {
          plugin.build(config, true)
        }

      }
      //wc.log({state:'start',txt:'编译js:'})
    }
    if (config.configFile) {
      var configFile = config.configFile.replace(/\\/g, '\\\\');
      configFile = configFile.replace(/\.js/g, '')
      var wc_plugin_config = require(configFile);
      console.log(wc_plugin_config)
      if ($.isArray(wc_plugin_config)) {
        $.each(wc_plugin_config, function(i, v) {
          buildJsByConfig(v);
        })
      } else {
        buildJsByConfig(wc_plugin_config);
      }
    } else {
      buildJsByConfig(config);
    }
  }
})
