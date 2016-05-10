var cmd=require('wc-cmd');

var buildJs = function(config,log) {
  var $=$||require('jquery');
  var _log = $.isFunction(log)?log :log? function msg() {
   console.log.apply(console,arguments)
 }:new Function();
  _log({
    state:'start',
    txt:'build js start'
  })
  var buildJsByConfig = function(config) {
    if (config.plugin) {
      _log({
        state:'run',
        txt:'build '+config.src+' by '+ config.plugin
      })
      //var loadPlugin = require('./plugin/node_modules/wc-plugin');
      var loadPlugin = require('wc-plugin');
      var plugin = loadPlugin(config.plugin)
        //The plugin hasn't been install.
      if (plugin.install) {
        _log({
          state:'run',
          type:'warning',
          txt:"The plugin hasn't been install. wc is going to install it..."
        })
        //var pkg=require(config.path+'package.json');
        var installOver=function (_log,data) {
          _log({
              state:'run',
              type:'success',
              txt:config.plugin+' install over'
            }
          )
          return  loadPlugin(config.plugin,_log).build(config, _log);
        }
        var installOverCallback=installOver.bind(null,_log)
        console.log(config.path + config.plugin)
        console.log(require(config.path + config.plugin))
        try {
          //console.log(require(config.path + config.plugin))
          //test whether the pkg is there.
          var localPkg=require(config.path + config.plugin);
          _log('install from local pkg.')
        return plugin.install(config.path + config.plugin,_log)
              .then(installOverCallback)
        } catch (e) {
          //install from npm
          _log('can not install '+config.plugin+' with local pak. wc is trying to install it from npm.')
          return plugin.install(config.plugin,_log)
                .then(installOverCallback)
        }
        //finally {
          // var _msg='can not install '+config.plugin+', you can install it manually.'
          // _log({
          //   type:'error',
          //   txt:_msg
          // })
          // return Promise.reject(_msg);
        //}
      } else {
        _log({
          state:'run',
          txt: config.plugin+" is going to build js:"+config.src
        })
        return plugin.build(config, _log)
      }
    }

    if ('cmd' == config.type) {
      _log({
        state:'run',
        txt:'build js by '+ config.type
      })
      return cmd(config.cmdStr, null, _log);
    }
    //wc.log({state:'start',txt:'编译js:'})
  }
  setTimeout(function() {
    if (config.configFile) {
      var configFile = config.configFile.replace(/\\/g, '\\\\');
      configFile = configFile.replace(/\.js/g, '')
      var wc_plugin_config = require(configFile);
      _log({
        state:'run',
        txt:['parse config file',wc_plugin_config]
      })
      // if ($.isArray(wc_plugin_config)) {
      if (Array.isArray(wc_plugin_config)) {
        if(wc_plugin_config.length==0){
          return Promise.reject(new Error('WC PLUGIN CONFIG ERROR!')) ;
        }else if (wc_plugin_config.length==1) {
          return buildJsByConfig(wc_plugin_config[0]);
        }
        //executing command by order
        wc_plugin_config.reduce(function _buildJsByConfigOrder(prefCommand,currentCommand) {
          return buildJsByConfig(prefCommand).then(function () {
            return buildJsByConfig(currentCommand);
          })
        })
        // $.each(wc_plugin_config, function(i, v) {
        //   buildJsByConfig(v);
        // })
      } else {
        buildJsByConfig(wc_plugin_config);
      }
    } else {
      buildJsByConfig(config);
    }
  },500)

}
module.exports.buildJs = buildJs;
