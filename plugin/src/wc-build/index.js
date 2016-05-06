var cmd=require('wc-cmd');

var buildJs = function(config,log) {
  var $=$||require('jquery');
  var _log = $.isFunction(log)?log :log? function msg(msg) {
    console.log(msg)
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
          return  loadPlugin(config.plugin).build(config, _log);
        }
        var installOverCallback=installOver.bind(null,_log)
        return plugin.install(config.path + config.plugin,_log)
              .then(installOverCallback)
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
}
module.exports.buildJs = buildJs;
