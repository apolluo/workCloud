(function(global, factory) {
    factory(global);
  }(window, function(window, noGlobal) {
    const ROOT = './'
    const PLUGIN_ROOT = './plugin/'
      //const PLUGIN_DIR = ''
    const PLUGIN_DIR = './plugin/node_modules/';
    var verson = '0.1.0';
    var wc = function() {
      return new wc.fn.init();
    }
    wc.fn = wc.prototype = {
      verson: verson,
      constructor: wc
    }
    var init = wc.fn.init = function() {
      this.ROOT = ROOT;
      this.PLUGIN_ROOT = PLUGIN_ROOT
        //const PLUGIN_DIR = ''
      this.PLUGIN_DIR = PLUGIN_DIR;

    }
    init.prototype = wc.fn;
    //wc对象    wc原型
    wc.extend = wc.fn.extend = function() {
      var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
      // Handle a deep copy situation
      if (typeof target === "boolean") {
        deep = target;
        // skip the boolean and the target
        target = arguments[i] || {};
        i++;
      }
      // Handle case when target is a string or something (possible in deep copy)
      if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {};
      }
      // extend jQuery itself if only one argument is passed
      if (i === length) {
        target = this;
        i--;
      }
      for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
          // Extend the base object
          for (name in options) {
            src = target[name];
            copy = options[name];
            // Prevent never-ending loop
            if (target === copy) {
              continue;
            }

            // Recurse if we're merging plain objects or arrays
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];

              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }

              // Never move original objects, clone them
              target[name] = jQuery.extend(deep, clone, copy);

              // Don't bring in undefined values
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }

      // Return the modified object
      return target;
    };

    wc.extend({
      getLocalData:function(name){
        if(localStorage){
          return localStorage[name]
        }else{
          console.log('不能读取数据：'+name)
        }
      },
      setLocalData:function(name,value){
        if(localStorage){
          localStorage[name]=value;
        }else{
          console.log('不能保存数据：'+name)
        }
      },
      cmd:require(PLUGIN_DIR+'wc-cmd'),
      buildJs:require(PLUGIN_DIR+'wc-build').buildJs,
      plugin:require(PLUGIN_DIR+'wc-plugin')
    });
    window.wc=global.wc=wc;
  })
)
