//var $ = require('jQuery');
var cmd = function(command, callback, log) {
  var _callback = callback || function() {
    return arguments;
  }
  var _log = log || function() {
    return arguments;
  }
  if (!command) {
    _log({
      state: 'error',
      txt: 'The command is not found!'
    })
    return Promise.reject();
  }

  if ($.isArray(command)) {
    //parse command queue by order
    return command.reduce(
      function(prefCommand, currentCommand) {
        return cmd(prefCommand,null,_log)
          .then(function() {
            return cmd(currentCommand,null,_log)
          })
          //return prefCommand.then(currentCommand)
      });

  } else if ($.isPlainObject(command)) {
    //parse command queue by random
    var allPromis = []
    $.each(command, function(k, v) {
      allPromis.push(cmd(v,null,_log));
    });
    return Promise.all(allPromis);
  } else {
    //execute command
    _log({
      state: 'start',
      txt: 'command start: ' + command
    });
    var _promise = new Promise(function(resolve, reject) {
      var exec = require('child_process').exec;
      var child = exec(command, {
        encoding: 'utf-8'
      });
      // var iconv = require('iconv-lite');
      // var Buffer = require('bufferhelper');
      var _data = [];
      var _error = []
        //var buffer
      _log({
        state: 'run',
        txt: 'executing: ' + command
      });
      //child.stdout.setEncoding('utf-8')
      //get msg from child
      child.stdout.on('data', function(data) {
        //  buffer = new Buffer(data);
        // var str = iconv.decode(buffer, 'gbk');
        _data.push(data);
        var code = data.code || data;
        _log({
          state: 'run',
          type: data.code,
          txt: data
        });
        switch (code) {
          case 'error':
            reject();
            break;
          case 'ok':
            resolve();
            break;
          default:
            reject();
            break;
        }
      });

      child.stderr.on('data', function(data) {
        _error.push(data)
        _log({
            state: 'run',
            type: 'error',
            txt: data
          })
          //reject();
      });

      child.stdout.on('end', function(data) {
        _log({
            state: 'run',
            type: 'end',
            txt: 'command complete'
          })
          //reject();
      });
      child.on('close', function(code) {
        _callback();
        _log({
          state: 'stop',
          type: 'close',
          txt: 'close cmd process'
        })
        resolve(_data);
      });
    })
    return _promise;
  }
}
module.exports=cmd;
