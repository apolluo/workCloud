# wc-cmd
## execute cmd for windows on nodejs

![Demo](https://raw.githubusercontent.com/apolluo/workCloud/v0.1.1/plugin/src/wc-cmd/test/cmdTest.png)

## Installation

    npm install wc-cmd

## Usage

It returns a promise, so you can use it like this to execute a cmd.

```js
var cmd = require('wc-cmd')
cmd('mkdir hh').then(
		function(data) {
			console.log(process.cwd());
		}
	)
	.then(
		function() {
			return cmd('dir')
		}
	)
	.then(function(data) {
		console.log(data.join(''))
		console.log('all cmd over!')
	})
```

And you can execute cmd queue in a array.

```js
cmd(['rd hh', 'dir'])
	.then(
		function(data) {
			console.log(data.join(''))
		}
	);
	
```

### Using standard API
```js
/**
 * @param {string,array,object} command is a cmd command on windows.
 * @param {function} callback  The function will be called when command is over.
 * @param {function,boolean} log=[function|true|false] 
 * @return {Promise}
 * @example
 * cmd('cd ../',null,console.log)
 */ 
cmd(command,callback,log)	
```
