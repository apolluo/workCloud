const ROOT = './'
const PLUGIN_ROOT = './plugin/'
  //const PLUGIN_DIR = ''
const PLUGIN_DIR = './plugin/node_modules/';
const PLUGIN_PKG='../../package.json'
var $ = require('jquery')
var pluginStore = $.extend(pluginStore, {
  all: {
    list: function(isGlobal) {
      return isGlobal ? 'npm list -g --depth=0' : 'cd plugin && npm list --depth=0'
    },
    uninstall: function(name, isGlobal) {
      return 'cd plugin && npm uninstall ' + name + (isGlobal ? ' -g' : ' --save-dev')
    },
    update: function(name, isGlobal) {
      return 'cd plugin && npm update ' + name + (isGlobal ? ' -g' : ' --save-dev')
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

var plugin = function(name) {
  return new plugin.fn.init(name)
}
plugin.fn = plugin.prototype = {
  name: null,
  v: null,
  ROOT: ROOT,
  PLUGIN_ROOT: PLUGIN_ROOT,
  PLUGIN_DIR: PLUGIN_DIR
}

/**
 * @constructor
 */
var init = plugin.fn.init = function(name,param) {
  this.name = name;
  if($.isPlainObject(param)){
    $.extend(this,param);
  }
  console.log(this)
  //var _this = this;
  var pluginAPI = pluginStore[name];
  console.log('pluginStore', pluginStore)
    //not core plugin
  if (!pluginAPI) {
    pluginAPI = {};
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
          'install': 'cd plugin && npm install --save-dev '
        }
    }

  }
  console.log('pluginAPI', pluginAPI)
  $.each(pluginAPI, function(k, command) {
    switch (k) {
      case 'install':
        plugin.fn[k] = function(pkg) {
          if (pkg) {
            return wc.cmd(command + pkg).then(function() {
              delete plugin.fn[k];
            });
          }
          return wc.cmd([
            command,
            pluginAPI.check,
            'npm install ' + pluginAPI.require.join(" ") + ' --save-dev'
          ].join(' && '), null, true)
        }
        break;
        // case 'build':
        //   plugin.fn[k] = _this.core.build;
        //
        //   break;
      default:
        plugin.fn[k] = function() {
          if ($.isFunction(command)) {
            return wc.cmd(command.apply(null, arguments))
          } else if ($.isPlainObject(command)) {
            return command.ex.apply(null, arguments);
          } else {
            return wc.cmd(command, null, true);
          }
        }
    }

  });
}
init.prototype = plugin.fn;
module.exports = plugin;
