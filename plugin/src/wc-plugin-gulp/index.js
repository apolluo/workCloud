//'use strict';
var gulp = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var wrapper = require("gulp-wrapper");
//var jshint = require('gulp-jshint')
var eslint = require('gulp-eslint')
var merge,include,concat
//must return a promise
var build = function(configFile, log) {
  var _log = $.isFunction(log) ? log : log ? function msg() {
    console.log.apply(console, arguments)
  } : new Function();
  _log({
    state: 'start',
    txt: 'config file: ' + configFile
  })
  var _promise = new Promise(function(resolve, reject) {

    var config = configFile;
    if (typeof configFile == 'string') {
      configFile = configFile.replace(/\\/g, '\\\\')
      config = require(configFile)
    }
    //console.log(config)

    var currentTime = function() {
        var
          t = new Date,
          y = t.getYear() < 1900 ? 1900 + t.getYear() : t.getYear();
        return y + "-" + (t.getMonth() * 1 + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
      }
      //console.log(config.compress)

    var stream
    if (typeof config.src == 'string') {
      stream = gulp.src([config.path + config.src])
    } else {
      var src = config.src.map(function(o, i) {
        return config.path + o;
      })
      stream = gulp.src(src)
    }

    //console.log("src:", config.src, src)
    stream.on('data', function(data) {
        _log('wc-plugin-gulp is loading file: ' + config.path + config.src)
          //console.log('stream: ------', data)
      })
      // if (log) {
      //   wc.log({
      //     state: 'loading',
      //     txt: 'gulp file：' + config.path + config.src
      //   })
      // }
    switch (config.type) {
      case 'temp':
        _log({
          state: 'loading',
          txt: 'merge file'
        })
        merge = merge||require("wc-temp-merge");
        stream = stream.pipe(merge());
        break;
      case 'include':
        _log({
          state:'loading',
          txt:'include file'
        })
        include = include || require("wc-file-include");
        stream = stream.pipe(include({
          prefix: '@@',
          basepath: config.path + 'core'
        }));
        //console.log('include over')
        break;
      default:
        _log({
          state: 'loading',
          txt: 'concat file'
        })
         concat =concat|| require('gulp-concat');
        stream = stream.pipe(concat('all.js'));
        break;

    }
    stream.on("error", function(err) {
      _log({
        state: 'run',
        type: 'danger',
        txt: err
      })
    })

    //publish debug version
    .pipe(rename(config.debug.name))
      .pipe(gulp.dest(config.debug.path))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError())
      .on("error", function(err) {
        _log({
          state: 'run',
          type: 'danger',
          txt: err
        })
      })
      //compress with uglify
      .pipe(uglify(
        config.uglify_config || {
          "output": {
            "ascii_only": true,
            "max_line_len": 1024
          },
          "compress": {
            //it will also filter funcions which name are a,b,c,d,e,f or g ？？？
            //pure_funcs: ['abcefgh','console.log', 'alert'],
            "unused": true,
            "dead_code": true,
            drop_debugger: true,
            drop_console: true,
            "global_defs": {
              "DEBUG": false
            }
          }
        }
      ))
      .on('error', function(err) {
        //  console.log('err------', err)
        _log({
          state: 'run',
          type:'danger',
          txt: err
        })

        // handle the error
      })
      // .catch(function(error) {
      //   console.log(error)
      //      // you know this only happened for that specific pipe ^
      //   })
      // add timeline to header
      .pipe(wrapper({
        "header": ";/*" + currentTime() + "*/"
      }))
      //publish the release version
      .pipe(rename(config.release.name))
      .pipe(gulp.dest(config.release.path));

    stream.on('end', function _buildEnd() {
        _log({
          state: 'run',
          type:'success',
          txt: 'build over'
        })
        resolve();
      })
      //return stream;
  });
  return _promise;
}
module.exports.build = build;
