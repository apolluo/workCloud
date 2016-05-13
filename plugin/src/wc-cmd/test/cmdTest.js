var cmd = require('../../wc-cmd')
var color = require('colors')
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
		console.log('cmd over'.red, data.join(''))
		console.log('all cmd over!'.blue)
	})
setTimeout(function() {
	cmd(['rd hh', 'dir'])
		.then(function(data) {
			console.log(data.join('').red)
		})
}, 5000)