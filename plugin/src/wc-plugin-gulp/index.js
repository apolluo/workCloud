//'use strict';
var gulp = require("gulp");
var merge = require("wc-temp-merge");
var include = require("gulp-file-include");
var rename = require("gulp-rename");
var uglify2 = require("gulp-uglify");
var wrapper = require("gulp-wrapper");
var jshint = require('gulp-jshint')
var eslint = require('gulp-eslint')
var concat = require('gulp-concat');

var build = function(configFile, log) {

  console.log(configFile)
  if (log) {
    wc.log({
      state: 'start',
      txt: 'config file: ' + configFile
    })
  } else {
    bootbox.loading('加载中，请稍候...')
  }
  var config = configFile;
  if (typeof configFile == 'string') {
    configFile = configFile.replace(/\\/g, '\\\\')
    console.log(configFile)
    config = require(configFile)
  }
  console.log(config)

  var currentTime = function() {
    var
      t = new Date,
      y = t.getYear() < 1900 ? 1900 + t.getYear() : t.getYear();
    return y + "-" + (t.getMonth() * 1 + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  }
  console.log(config.compress)

  var stream
  if (typeof config.src == 'string') {
    stream = gulp.src([config.path + config.src])
  } else {
    var src = config.src.map(function(o, i) {
      return config.path + o;
    })
    stream = gulp.src(src)
  }

  console.log("src:", config.src, src)
  stream.on('data', function(data) {
    console.log('stream: ------', data)
  })
  if (log) {
    wc.log({
      state: 'loading',
      txt: 'gulp file：' + config.path + config.src
    })
  }
  switch (config.type) {
    case 'temp':
      if (log) {
        wc.log({
          state: 'loading',
          txt: 'merge file'
        })
      }
      stream = stream.pipe(merge());
      break;
    case 'include':
      console.log('include')
      stream = stream.pipe(include({
        prefix: '@@',
        basepath: config.path + 'core'
      }));
      console.log('include over')
      break;
    default:
      if (log) {
        wc.log({
          state: 'loading',
          txt: 'concat file'
        })
      }
      stream = stream.pipe(concat('all.js'));
      break;

  }

  //   .pipe(rename(function(path) {
  //     path.basename = path.basename.replace("_temp", "_raw");
  //   }))
  //  .pipe(merge())
  console.log('merge over', stream)
    //包含log及debug信息
    //stream.pipe(rename('all-debug.js'))
  stream.pipe(rename(config.debug.name))
    //.pipe(gulp.dest(config.path + "/debug"))
    .pipe(gulp.dest(config.debug.path))
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    //.pipe(eslint.failAfterError())
    // .pipe(jshint({ "lookup": false}))
    //   .pipe(jshint.reporter('default'))
    //使用uglify2压缩混淆
    .pipe(uglify2(
      config.uglify_config
    // {
    //   "output": {
    //     "ascii_only": true,
    //     "max_line_len": 1024
    //   },
    //   //'compress': config.compress
    //
    //   // 'compress':  {
    //   //   "pure_funcs": ['console.log', 'alert'],
    //   //   "unused": true,
    //   //   "dead_code": true,
    //   //   "global_defs": {
    //   //     "DEBUG": false,
    //   //     "DIA_VERSION": '0.1.0'
    //   //   }
    //   // }
    //   "compress": {
    //     //过滤 a\b\c\d\e\f\g函数 ？？？
    //     //pure_funcs: ['abcefgh'],
    //     "unused": true,
    //     "dead_code": true,
    //     drop_debugger: true,
    //     drop_console: true,
    //     "global_defs": {
    //       "DEBUG": false
    //         // "DEBUG": true,
    //         // "MAM_MD": md.mapData,
    //         // "MAM_QR":md.qrcode,
    //         // "MAM_FREQ_LOCK":md.fred
    //     }
    //   }
    // }
    ))
    .on('error', function(err) {
      console.log('err------', err)
      if (log) {
        wc.log({
          state: 'loading',
          txt: err
        })
      }
      // handle the error
    })
    // .catch(function(error) {
    //   console.log(error)
    //      // you know this only happened for that specific pipe ^
    //   })
    // 添加时间戳等附属信息
    .pipe(wrapper({
      "header": ";/*" + currentTime() + "*/"
    }))
    //发布版本，即压缩版本
    .pipe(rename(config.release.name))
    .pipe(gulp.dest(config.release.path));

  if (log) {
    wc.log({
      state: 'loading',
      txt: 'over'
    })
  }
  // var stream = gulp.src("projs/mqq/src/*_temp.js")
  //   .pipe(merge())
  //   .pipe(rename(function(path) {
  //     path.basename = path.basename.replace("_temp", "_raw");
  //   }))
  //   .pipe(gulp.dest("projs/mqq/dist"));
  return stream;
}
module.exports.build = build;
