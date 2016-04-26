wc.app.controller('c_proj_config', function($scope, wcData) {
	var
		Config = require('./model/config')
	var proj = $scope.proj = wc.getLocalData('current_proj');
	$scope.showCMD = false;
	$scope.showConfigFile = false;
	var getConfigCallback = function(result, data) {
		if (result == 'success') {
			console.log(data)
				//$scope.currentConfigName = data;
			$scope.allConfigs = data;
			//去掉数据不会更新
			$scope.$apply();
		}
	}

	console.log('c_proj_config')
	console.log('wcData')
	console.log(wcData)
	var loadConfig = wcData.loadConfig = function(proj, src) {
		$scope.proj = wc.getLocalData('current_proj');
		Config.getConfig(proj, getConfigCallback);
	}
	loadConfig(proj)
		//Config.getConfig(proj, getConfigCallback);
	$scope.run = function(config) {
			if (config) {
				wc.buildJs(config)
			} else {
				wc.buildJs({
					name: $scope.configName,
					type: $scope.configType,
					cmdStr: $scope.configCmd,
					configFile: $('#configFile').val(),
					info: $scope.info
				})
			}
		}
		// $('#configType').on('change',function(){
		//   console.log(1)
		// })
		//ng-change不触发，估计在webkit环境无法触发
	$scope.selectConfig = function(configType) {
		//$scope.$apply(function() {
		console.log(1)
		console.log(configType)
		if (configType == 'cmd') {
			$scope.showCMD = true;
			$scope.showConfigFile = false;
		} else if (configType == 'gulp') {
			$scope.showCMD = false;
			$scope.showConfigFile = true;
		} else {
			$scope.showCMD = false;
			$scope.showConfigFile = false;
		}
		//});
	}

	var saveCallBack = function(result, data) {
		console.log(wc.getLocalData('current_proj') + '的配置保存成功')
		console.log(data)
		bootbox.success(wc.getLocalData('current_proj') + '的配置保存成功', function() {
			$scope.allConfigs.push(data);
			$scope.$apply();
		})

	}
	var configCallback = function(index) {
			console.log(wc.getLocalData('current_proj') + '的配置删除成功')
			bootbox.success(wc.getLocalData('current_proj') + '的配置删除成功', function() {
				console.log($scope.allConfigs)
				console.log(index)
				if ($.isNumeric(index)) {
					$scope.allConfigs.splice(index, 1);
					$scope.$apply();
				}

			})
		}
		/**
		 *
		 * @description delete config by id(default) or database field name
		 * @param  {[id, obj]} configOption [use {prj:projName} to delete data where prj=projName ]
		 * @return {[type]}              [description]
		 */

	$scope.delete = wcData.deleteConfig = function(configOption, index) {
		//return console.log(id)
		Config.delete(configOption, function() {
			configCallback(index)
		})
	}

	$scope.save = function(data) {
		console.log(data)
			//更新
		if (data) {
			Config.modify([
				data.name, data.type, data.configFile, data.cmdStr, data.info, wc.getLocalData('current_proj'),
				data.id
			], saveCallBack)
		} else {
			console.log(this.configName, $scope.configName)
			Config.save([
				$scope.configName, $scope.configType, $('#configFile').val(), $scope.configCmd, $scope.info,
				wc.getLocalData('current_proj')
			], saveCallBack)
		}
		//先保存项目
		// Projs.save([name, wc.getLocalData('current_proj'), '', ''], function() {
		//   console.log('项目保存成功')
		//   saveConfig();
		// })
		//console.log(configName)

	}
})
