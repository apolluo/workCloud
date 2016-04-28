wc.extend((function() {
  const ROOT = './'
  const PLUGIN_ROOT = './plugin/'
    //const PLUGIN_DIR = ''
  const PLUGIN_DIR = './plugin/node_modules/'
  var pluginStore = {
      all: {
        // projPlugin:'npm list --depth=0',
        // globalPlugin:'npm list -g --depth=0',
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
      },
      through2: {
        install: 'npm install through2 --save-dev'
      },
      underscore: {
        install: 'npm install underscore --save-dev'
      },
      'gulp-jshint': {
        install: 'npm install gulp-jshint --save-dev'
      },
      'gulp-uglify': {
        install: 'npm install gulp-uglify --save-dev'
      },
      'gulp-concat': {
        install: 'npm install gulp-concat --save-dev'
      },
      'gulp-rename': {
        install: 'npm install gulp-rename --save-dev'
      },
      'gulp-wrapper': {
        install: 'npm install gulp-wrapper --save-dev'
      },
      'gulp': {
        //install: 'xcopy package\\gulp plugin /e /y && cd plugin && npm install -g gulp && npm install --save-dev gulp',
        install: 'cd plugin && npm install -g gulp && npm install --save-dev gulp',
        check: 'gulp -v',
        require: ['gulp-uglify', 'gulp-jshint', 'gulp-eslint', 'gulp-concat', 'gulp-rename', 'gulp-wrapper', 'through2', 'underscore'],
        uninstall: 'npm uninstall <name> [-g] [--save-dev]',
        update: 'npm update <name> [-g] [--save-dev]'
      }
    }
    /**
     * @alias plugin
     * @param {Object} name
     * @description manager plugins,install
     */
  var plugin = function(name) {
    // var core=require(PLUGIN_DIR + name);
    // var pluginAPI = pluginStore[name];
    // $.each(pluginAPI, function(k, command) {
    //   switch (k) {
    //     case 'install':
    //       core[k] = function() {
    //         return wc.cmd([
    //           command,
    //           pluginAPI.check,
    //           'npm install ' + pluginAPI.require.join(" ") + ' --save-dev'
    //         ].join(' && '), null, true)
    //       }
    //       break;
    //     case 'build':
    //       core[k] = _this.core.build;
    //
    //       break;
    //     default:
    //       core[k] = function() {
    //         if ($.isFunction(command)) {
    //           return wc.cmd(command.apply(null, arguments))
    //         } else {
    //           return wc.cmd(command, null, true);
    //         }
    //       }
    //   }
    //
    // });
    //
    // return core;
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
  var init = plugin.fn.init = function(name) {
    this.name = name;
    //var _this = this;
    var pluginAPI = pluginStore[name];
    if(!pluginAPI){
      pluginAPI={}
      this.core = require(PLUGIN_DIR + name);
      $.each(this.core,function (k,v) {
        pluginAPI[k]={
          ex:v
        }
      })
    }

    $.each(pluginAPI, function(k, command) {
      switch (k) {
        case 'install':
          plugin.fn[k] = function() {
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
            }else if ($.isPlainObject(command)) {
              return command.ex.apply(null,arguments);
            }
            else {
              return wc.cmd(command, null, true);
            }
          }
      }

    });

    //返回值会修改原型，将无法继承
    //return _plugin;
    // var install=function(){
    //   //workCloud root dir
    //   //return wc.cmd('dir')
    //   //check
    //   //return wc.cmd(pluginStore[name].check).catch(wc.cmd(pluginStore[name].install))
    //   return wc.cmd([pluginStore[name].install,pluginStore[name].check,
    //     'npm install '+pluginStore[name].require.join(" ")+' --save-dev' ])
    // }
    // var addProj=function(dir){
    //
    // }
    // var run =function(command,success,fail){
    //   return wc.cmd(pluginStore[this.name][command]())
    //   .then(success)
    //   .catch(fail)
    // }
    //
    // return {
    //   name:name,
    //   install:install,
    //   addProj:addProj,
    //   run:run
    // }
  }
  init.prototype = plugin.fn;
  //wc.plugin('gulp').install
  // wc.plugin('gulp').uninstall
  // wc.plugin('gulp').core===require('gulp')
  // wc.plugin('gulp').build(config,log)
  return {
    plugin: plugin
  }
}()))
