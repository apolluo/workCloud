var $ =$|| require('jquery')

var _log;
var plugin = function(name,log) {
  _log = $.isFunction(log)?log :log? function msg() {
   console.log.apply(console,arguments)
 }:new Function();
  return new plugin.fn.init(name)
}
plugin.fn = plugin.prototype = {
  name: 'wc-plugin',
  v: null,
  pluginStore:{},
  initPluginStore:function _initPluginStore(pluginRoot) {
    $.extend(this.pluginStore, {
  all: {
    list: function(isGlobal) {
          return isGlobal ? 'npm list -g --depth=0' : 'cd '+pluginRoot+' && npm list --depth=0'
    },
    uninstall: function(name, isGlobal) {
          return 'cd '+pluginRoot+' && npm uninstall ' + name + (isGlobal ? ' -g' : ' --save-dev')
    },
    update: function(name, isGlobal) {
          return 'cd '+pluginRoot+' && npm update ' + name + (isGlobal ? ' -g' : ' --save-dev')
    }
  },
  npm: {
    proxy: function(url) {
      if (url) {
        return 'npm config set proxy ' + url;
      } else {
        return 'npm config get proxy'
      }
    }
  },
  settings: {

  },
  node: {
    check: 'node -v'
  }
})
}
}

/**
 * @constructor
 */
var init = plugin.fn.init = function(name,param) {
  this.name = name;
  var path=require('path')
  // console.log('path---------:'+path.resolve('./'))
  // console.log(__dirname)
  // console.log(__filename)
  // console.log(process.cwd())
  // console.log(path.resolve( __dirname,'../'))

  this.NODE_ROOT= process.cwd()
  this.PLUGIN_DIR= __dirname
  this.PLUGIN_ROOT= path.resolve( this.PLUGIN_DIR,'../../')

  if($.isPlainObject(param)){
    $.extend(this,param);
  }
  //console.log(this)
  //var _this = this;
  this.initPluginStore(this.PLUGIN_ROOT)
  var pluginAPI = this.pluginStore[name];
  //console.log('pluginStore', pluginStore)
    //not core plugin
  if (!pluginAPI) {
    pluginAPI = {};
    _log('init plugin: '+name)
    //console.log('init plugin: '+name)
    // delete require.cache[require.resolve(PLUGIN_PKG)]
    // $.extend(pluginStore, require(PLUGIN_PKG).devDependencies);
    // console.log('pluginStore', pluginStore)
    try {
      //The plugin is installed as extend plugin.
      this.core = require(name);
      $.each(this.core, function(k, v) {
        pluginAPI[k] = {
          ex: v
        }
      })
    } catch (e) {
      //The plugin hasn't been installed
        pluginAPI = {
          'install': 'cd '+this.PLUGIN_ROOT+' && npm install --save-dev '
        }
    }

  }
  var cmd=require('wc-cmd')
  //console.log('pluginAPI', pluginAPI)
  $.each(pluginAPI, function(k, command) {
    switch (k) {
      case 'install':
        plugin.fn[k] = function(pkg,log) {
          //install from local pkg
          if (pkg) {
            return cmd(command + pkg,null,log).then(function() {
              //console.log('install over')
              delete plugin.fn[k];
              //console.log(plugin.fn)
            });
          }
          return cmd([
            command,
            pluginAPI.check,
            'npm install ' + pluginAPI.require.join(" ") + ' --save-dev'
          ].join(' && '), null, log)
        }
        break;
        // case 'build':
        //   plugin.fn[k] = _this.core.build;
        //
        //   break;
      default:
        plugin.fn[k] = function() {
          if ($.isFunction(command)) {
            return cmd(command.apply(null, arguments),null,_log)
          } else if ($.isPlainObject(command)) {
            return command.ex.apply(null, arguments);
          } else {
            return cmd(command, null, _log);
          }
        }
    }

  });
}
init.prototype = plugin.fn;
module.exports = plugin;
