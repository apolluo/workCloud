// var readFile = require('fs-readfile-promise');
//
// readFile(fileA)
// .then(function(data){
//   console.log(data.toString());
// })
// .then(function(){
//   return readFile(fileB);
// })
// .then(function(data){
//   console.log(data.toString());
// })
// .catch(function(err) {
//   console.log(err);
// });
//
// var readdir = require('fs-readdir-promise');
//
// readdir('path/to/dir')
// .then(function(files) {
//   console.log(files);
// })
// .catch(function(err) {
//   console.log(err.message);
// });

var myFile = (function() {


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
    readDir: myReadDir
  }
})();
