wc.app.controller('c_settings', function($scope, wcData) {
	$scope.npm = {
		proxy: '',
		set: function(key, v) {
			switch (key) {
				case 'proxy':
					wc.plugin('npm',wc.loading).proxy(v)
						.then(function(data) {
							bootbox.hideAll();
							console.log(data)
						})
					break;
				default:
					break;
			}
		}
	}
	wc.plugin('npm',wc.loading).proxy()
		.then(function(data) {
			bootbox.hideAll();
			console.log(data)
			if (data && data.length > 0) {
				$scope.npm.proxy = data[0];
				$scope.$apply();
			}
		})
});
