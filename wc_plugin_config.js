//要编译的项目目录
var path='D:\\doSomething\\workCloud\\';
var wc_gulp_config=[
  {
    path: path,
    //要编译的文件
    //src: '*_temp.js',['js/**/*.js', '!js/**/*.min.js'],
    src: ['src\\main.js','src\\data.js'],
    //type:'concat/temp/include',
    type: 'concat',
    plugin:'wc-plugin-gulp',
    debug: {
      path: path+'debug',
      name: 'crystal-debug.js'
    },
    release: {
      path: path+'release',
      name: 'crystal-min.js'
    }
  }
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
module.exports=wc_gulp_config
