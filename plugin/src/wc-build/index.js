var cmd=require('wc-cmd');
var $=require('jquery');
var buildJs = function(config,log) {
  var _log=log||function () {
    return arguments;
  }
  _log({
    state:'start',
    txt:'build js start'
  })
  var buildJsByConfig = function(config) {
    _log({
      state:'run',
      txt:'build js by '+ (config.type||config.plugin)
    })

    if (config.plugin) {
      //var loadPlugin = require('./plugin/node_modules/wc-plugin');
      var loadPlugin = require('wc-plugin');
      var plugin = loadPlugin(config.plugin)
        //The plugin hasn't been install.
      if (plugin.install) {
        _log({
          state:'run',
          txt:"The plugin hasn't been install. wc is going to install it..."
        })
        //var pkg=require(config.path+'package.json');
        plugin.install(config.path + config.plugin)
      } else {
        _log({
          state:'run',
          txt: config.plugin+" is going to build js..."
        })
        plugin.build(config, true)
      }
    }

    if ('cmd' == config.type) {
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
module.exports.buildJs = buildJs;
