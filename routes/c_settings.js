wc.app.controller('c_settings', function($scope, wcData) {
	function _loading() {
		 wc.log.apply(null,arguments)
		//bootbox.loading('加载中，请稍候...');
	}
	$scope.npm = {
		proxy: '',
		set: function(key, v) {
			switch (key) {
				case 'proxy':
					wc.plugin('npm',_loading).proxy(v)
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
	wc.plugin('npm',_loading).proxy()
		.then(function(data) {
			bootbox.hideAll();
			console.log(data)
			if (data && data.length > 0) {
				$scope.npm.proxy = data[0];
				$scope.$apply();
			}
		})
});
