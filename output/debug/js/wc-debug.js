(function(global, factory) {
    factory(global);
  }(window, function(window, noGlobal) {
     const ROOT = './'
     const PLUGIN_ROOT = './plugin/'
    //   //const PLUGIN_DIR = ''
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
      // this.ROOT = ROOT;
      // this.PLUGIN_ROOT = PLUGIN_ROOT
      //   //const PLUGIN_DIR = ''
      // this.PLUGIN_DIR = PLUGIN_DIR;

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

//$('#button').button();
//$("#ngview").niceScroll({cursorcolor:"#00F"});
wc.extend({
  scroll: function(selector) {
    selector = (selector.indexOf('#') == 0) ? selector : '#' + selector
    $(selector).niceScroll({
      cursorcolor: "#ccc",
      cursorwidth: "10px",
      cursorminheight: 32
    })
  },
  loading: function _loading() {
    bootbox.loading('加载中，请稍候...');
  },
  showDir: function(data, id) {
    console.log("showDir")
    console.log(data)
    var _list = id || '#currentProj'
      //刷新
    if ($(_list).children().length > 0) {
      $(_list).jstree(true).settings.core.data = data
      $(_list).jstree(true).refresh();
    } else { //初始化
      //console.log($(_list).jstree)
      $(_list).jstree({
        'core': {
          "check_callback": true,
          'data': [
            data
          ]
        }
      });
    }
    $(_list).css('max-height', parseInt($(_list).parent().css('max-height')) - 25);
    wc.scroll(_list)
      // var _data = data;
      // loadProj(data.text)
  },
  // bx: (function() {
  //   "use strict";
  //
  //   var elem,
  //     hideHandler,
  //     that = {};
  //
  //   that.init = function(options) {
  //     elem = $(options.selector);
  //   };
  //
  //   that.show = function(text) {
  //     clearTimeout(hideHandler);
  //
  //     elem.find("span").html(text);
  //     elem.delay(200).fadeIn().delay(4000).fadeOut();
  //   };
  //   $(function() {
  //     that.init({
  //       "selector": ".bb-alert"
  //     });
  //   });
  //
  //   return that;
  // }()),
  /**
   * [function description]
   * @param  {[type]} msg [
   * log(1,2,3),
   * log(''),
   * log({
   * 	state:'start/loading/run/end/close/stop',
   * 	type:'error/warn/data',
   * 	txt:[]/{}/''
   * })]
   * @return {[type]}     [description]
   */
  log: function(msg) {
    if (msg) {
      var _txt = '';
      if (msg.hasOwnProperty('txt')) {
        if ($.isArray(msg.txt)) {
          _txt = msg.txt.join(" ");
        } else if ($.isPlainObject(msg.txt)) {
          _txt = JSON.stringify(msg.txt);
        } else if ($.isFunction(msg.txt)) {
          _txt = msg.txt();
        } else {
          _txt = msg.txt;
        }
      } else {
        _txt = [].slice.call(arguments).join(" ")
      }

      switch (msg.state) {
        case 'start':
          bootbox.dialog({
            message: '<ul id="wc_log_txt" style="max-height:250px;overflow-y:scroll;"><li class="text-info"><b>' + _txt + '</b></li></ul>',
            title: "消息提醒",
            className: "wc_log",
            formRb: true,
            backdrop: false
          });
          break;

        case 'end':
          setTimeout(function() {
            $('.wc_log').modal("hide");
          }, 3000);
          break;
        case 'loading':
          _txt += "..."
        case 'run':
          _txt = msg.state == 'run' ? ('<b>' + _txt + '</b>') : _txt;
          _txt += msg.type == 'success' ? "<hr/>" : ""
        default:
          var _class = "";
          switch (msg.type) {
            case 'error':
              _class = 'danger'
              break;
            case 'warn':
              _class = 'warning'
              break;
            default:
              _class = msg.type || "default"
              break;
          }
          setTimeout(function() {
            $('#wc_log_txt').append('<li class="text-' + _class + ' ">' + _txt + '</li>');
            $('#wc_log_txt').scrollTop($('#wc_log_txt')[0].scrollHeight)
          }, 500);
          break;

      }
    }

  },
  alert: function(option) {
    var _dialog = $("#alert");
    //_dialog.text = $('#alert .text')
    if ($.isPlainObject(option)) {
      if (option.id) {
        _dialog = $("#" + option.id);
        //  _dialog.text = $('#' + option.id + ' .text')
      }
      // if (option.text) {
      //   _dialog.text.html(option.text)
      // }

      //_dialog.attr('title', )

      //$("#dialog").dialog("open");
    } else { //string
      //_dialog.attr('title', '友情提示')
      $('#alert >.text').html(option);
      //_dialog.dialog();
    }
    _dialog.dialog({
      autoOpen: true,
      title: option.title || '友情提示',
      width: option.width || 400,
      buttons: option.buttons || [],
      modal: true,
      show: option.show || {
        effect: "blind",
        duration: 300
      },
      hide: option.hide || {
        effect: "explode",
        duration: 300
      }
    });
  },
  modal: (function() {
    var templates = {
        dialog: "<div class='modal fade' tabindex='-1' role='dialog'>" +
          "<div class='modal-dialog'>" +
          "<div class='modal-content'>" +
          "<div class='modal-body'><div class='bootbox-body'></div></div>" +
          "</div>" +
          "</div>" +
          "</div>",
        header: "<div class='modal-header'>" +
          "<h4 class='modal-title'></h4>" +
          "</div>",
        footer: "<div class='modal-footer'></div>",
        closeButton: "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",

        success: '<div class="modal-dialog">' +
          '<div class="modal-content">' +
          '<div class="modal-header">' +
          '<i class="glyphicon glyphicon-check"></i>' +
          '</div>' +
          '<div class="modal-title"></div>' +
          '<div class="modal-body"></div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>' +
          '</div>' +
          '</div>' +
          ' </div> ' +
          '</div>'

      },
      queue = {},
      state = function() {

      },
      component = function(options) {
        this.options = options;
      }
    component.prototype.__defineSetter__('options', function(options) {
      console.log('hah')
        //单一，不会被销毁
      if (options.id) {
        //初始化
        if (!queue[options.id]) {
          this.id = options.id;
          this.template = $(templates.dialog);
          this.template.attr('id', options.id);
          var body = this.template.find(".modal-body");
          if (typeof options.message == 'string') {
            body.find(".bootbox-body").html(options.message);
          } else {
            body.find(".bootbox-body").append(options.message);
          }

          if (options.title) {
            body.before(templates.header);
            this.template.find('.modal-title').html(options.title);
          }
          var buttons = options.buttons;
          console.log(options.closeButton, 'cl')
          if (options.closeButton) {
            var closeButton = $(templates.closeButton);

            if (options.title) {
              this.template.find(".modal-header").prepend(closeButton);
            } else {
              closeButton.css("margin-top", "-10px").prependTo(body);
            }
          }

          $('body').append(this.template)
          queue[options.id] = {
            target: this.template,
            isInit: true
          }
        }

        $('#' + options.id).modal('show')

      } else {

      }
    })

    var dialog = function(options) {
        if (!options.hasOwnProperty('closeButton') || options.closeButton !== false) {
          options.closeButton = true;
        }
        return new component(options);
      }
      //  dialog.init = function (options) {
      // }

    //dialog.init.prototype=component;
    //dialog.init.prototype=component.prototype;
    return {
      dialog: dialog,
      // loading:loading,
      // success:success,
      // danger:danger,
      hideAll: function() {
        $('.modal').modal('hide')
      }

    }
  }())
});

wc.extend({
  file:(function(){
    var fs = require('fs')
    var stats = [];
    var readDir = function(path, callback, showType) {
      var data = {
        "text": path,
        "state": {
          "opened": true
        },
        "children": []
      }
      var fs_dir_promise = require('fs-readdir-promise')
      fs_dir_promise(path).then(function(files) {
        if (!files.length) {
          return console.log(' No files to show!');
        }
        var i = 0;
        files.forEach(function(file) {
          //stat获取文件或目录信息
          fs.stat(path + '/' + file, function(err, stat) {
            if (err) {
              console.log(err);
              return;
            }
            if (showType == 'all') {
              if (stat.isDirectory()) {
                // 如果是文件夹遍历
                readDir(path + '/' + file);
              } else {
                // 读出所有的文件
                console.log('文件名:' + path + '/' + file);
              }
            } else { //只显示第一层目录
              if (stat.isDirectory()) {
                //console.log(file)
                data["children"].push({
                  "text": file
                })

              }
            }
            i++;
            if (i == files.length) {
              console.log(data)
              if (callback) {
                callback(data)
              }
            }
          })
        })
      })
    }
    return {
      readDir:readDir
    }
  }())
})

var myFile = (function() {
  var fs = require('fs')
  var stats = [];
  var readDir = function(path, callback, showType) {
    var data = {
      "text": path,
      "state": {
        "opened": true
      },
      "children": []
    }

    fs.readdir(path, function(err, files) {
      if (err) {
        console.log('error:\n' + err);
        return;
      }

      if (!files.length) {
        return console.log(' \033[31m No files to show!\033[39m\n');
      }
      var i = 0;
      files.forEach(function(file) {

        fs.stat(path + '/' + file, function(err, stat) {
          if (err) {
            console.log(err);
            return;
          }
          if (showType == 'all') {
            if (stat.isDirectory()) {
              // 如果是文件夹遍历
              readDir(path + '/' + file);
            } else {
              // 读出所有的文件
              console.log('文件名:' + path + '/' + file);
            }
          } else { //只显示第一层目录
            if (stat.isDirectory()) {
              //console.log(file)
              data["children"].push({
                "text": file
              })

            }
          }
          i++;
          if (i == files.length) {
            console.log(data)
            if (callback) {
              callback(data)
            }
          }
        });

      });


    });
    //  console.log(data)
    return data;
  }

  var readDir2 = function(path, callback, showType) {
    var data = {
      "text": path,
      "state": {
        "opened": true
      },
      "children": []
    }
    var fs_dir_promise = require('fs-readdir-promise')
    fs_dir_promise(path).then(function(files) {
      if (!files.length) {
        return console.log(' \033[31m No files to show!\033[39m\n');
      }
      var i = 0;
      files.forEach(function(file) {
        //stat获取文件或目录信息
        fs.stat(path + '/' + file, function(err, stat) {
          if (err) {
            console.log(err);
            return;
          }
          if (showType == 'all') {
            if (stat.isDirectory()) {
              // 如果是文件夹遍历
              readDir(path + '/' + file);
            } else {
              // 读出所有的文件
              console.log('文件名:' + path + '/' + file);
            }
          } else { //只显示第一层目录
            if (stat.isDirectory()) {
              //console.log(file)
              data["children"].push({
                "text": file
              })

            }
          }
          i++;
          if (i == files.length) {
            console.log(data)
            if (callback) {
              callback(data)
            }
          }
        })
      })
    })
  }


  return {
    readDir: readDir2
  }
})();
