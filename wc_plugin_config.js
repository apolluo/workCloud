//要编译的项目目录
var path = 'D:\\doSomething\\workCloud\\';

//压缩
var uglify_config = {
  mangle: false,
  output: {
    "ascii_only": true,
    "max_line_len": 256
  },
  compress: {
    "pure_funcs": ['console.log'],
    "unused": true,
    "dead_code": true,
    "global_defs": {
      "DEBUG": false,
      "PLATFORM": 'qq'
    }
  }
}
var wc_gulp_config = [{
      path: path,
      //要编译的文件
      src: ['js/main.js', 'js/ui.js', 'js/file.js'],
      //type:'concat/temp/include',
      type: 'concat',
      plugin: 'wc-plugin-gulp',
      uglify_config: uglify_config,
      debug: {
        path: path + 'output/debug/js',
        name: 'wc-debug.js'
      },
      release: {
        path: path + 'output/release/js',
        name: 'wc-min.js'
      }
    }, {
      path: path,
      //要编译的文件
      src: 'model/*.js',
      //type:'concat/temp/include',
      type: 'concat',
      plugin: 'wc-plugin-gulp',
      uglify_config: uglify_config,
      debug: {
        path: path + 'output/debug/js',
        name: 'wc-model-debug.js'
      },
      release: {
        path: path + 'output/release/js',
        name: 'wc-model-min.js'
      }
    }, {
      path: path,
      //要编译的文件
      src: ['routes/controller.js','routes/*.js'],
      //type:'concat/temp/include',
      type: 'concat',
      plugin: 'wc-plugin-gulp',
      uglify_config: uglify_config,
      debug: {
        path: path + 'output/debug/js',
        name: 'wc-routes-debug.js'
      },
      release: {
        path: path + 'output/release/js',
        name: 'wc-routes-min.js'
      }
    }, {
      path: path,
      //要编译的文件
      src: 'ui/bootbox_v2_for4.4.js',
      //type:'concat/temp/include',
      type: 'concat',
      plugin: 'wc-plugin-gulp',
      uglify_config: uglify_config,
      debug: {
        path: path + 'output/debug/ui',
        name: 'wc-ui-debug.js'
      },
      release: {
        path: path + 'output/release/ui',
        name: 'wc-ui-min.js'
      }
    }
    //html
    , {
      path: path,
      //要编译的文件
      src: 'index.html',
      //type:'concat/temp/include',
      type: 'html',
      plugin: 'wc-plugin-gulp',
      replace:{
        'css-bootbox':'ui/bootbox.min.css',
        'js':'js/wc-min.js',
        'js-model':'js/wc-model-min.js',
        'js-routes':'js/wc-routes-min.js',
        'js-ui':'ui/wc-ui-min.js'
      },
      debug: {
        path: path + 'output/debug/',
        name: 'index.html'
      },
      release: {
        path: path + 'output/release/',
        name: 'index.html'
      }
    }
    //css
    ,{
      path: path,
      //要编译的文件
      src: 'ui/bootbox_v2_for4.4.css',
      //type:'concat/temp/include',
      type: 'css',
      plugin: 'wc-plugin-gulp',
      debug: {
        path: path + 'output/debug/ui/',
        name: 'bootbox.min.css'
      },
      release: {
        path: path + 'output/release/ui/',
        name: 'bootbox.min.css'
      }
    }
    //copy file


  ]
  // {
  //   //要编译的项目目录
  //   path: 'D:\\doSomething\\workCloud\\projs\\mqq',
  //   //要编译的文件
  //   //src: '*_temp.js',['js/**/*.js', '!js/**/*.min.js'],
  //   src: '\\src\\*_temp.js',
  //   //type:'concat/temp',
  //   type: 'temp',
  //   debug: {
  //     path: 'D:\\doSomething\\workCloud\\projs\\mqq\\debug',
  //     name: 'dia_debug.js'
  //   },
  //   release: {
  //     path: 'D:\\doSomething\\workCloud\\projs\\mqq\\release',
  //     name: 'dia_release.js'
  //   }
  //   // ,
  //   // compress: {
  //   //   //it can't be array,why?
  //   //   pure_funcs: 'console.log, b , alert',
  //   //   "unused": true,
  //   //   "dead_code": true,
  //   //   "global_defs": {
  //   //     "DEBUG": false,
  //   //     "DIA_VERSION": '0.1.0'
  //   //   }
  //   // }
  // }
module.exports = wc_gulp_config;
