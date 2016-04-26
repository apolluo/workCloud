wc.app.controller('c_plugin', function($scope, wcData) {
	$scope.plugins = []
		//wc.plugin('all').run('list')
	var listPlugins = $scope.listPlugins = function() {
		wc.plugin('all').list()
			.then(function(data) {
				console.log('--plugins--')
				console.log(data)
				data = data.join(' ').match(/\S+@\d.*\d/g)
				console.log(data)
				$scope.plugins = $.map(data, function(v, i) {
					var _plugin = v.split('@')
					return {
						name: _plugin[0],
						version: _plugin[1]
					}
				})
				console.log($scope.plugins)
				$scope.$apply();
			})
			.then(function scroll() {
				wc.scroll('ngview')
			})
			.catch(function(data) {
				wc.alert(data)
			})
	}
	$scope.install = function(name) {
		wc.plugin(name).install()
			.then(function() {
				console.log('安装结束')
			})
			.catch(function(err) {
				console.log('安装失败')
			})
	}
	$scope.uninstall = function(name) {
		wc.plugin('all').uninstall(name)
			.then(
				function() {
					wc.alert('删除插件' + name + '成功')
					listPlugins();
				}
			).catch(
				function(err) {
					wc.alert('删除插件' + name + '失败: ' + err)
					listPlugins();
				}
			)
	}

	listPlugins();

})
