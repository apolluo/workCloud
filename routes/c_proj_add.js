/**
 * route controller
 * @type {[type]}
 */

wc.app.controller('c_proj_add', function($scope, wcData) {
		console.log('c_proj_add')
		var
		Projs = require('./model/projs'),
		showDir=wc.showDir
		$scope.createProj = function(projType) {
				console.log(projType)
				console.log($scope.projForm)
					//bootbox will remove dialog, with event close、modal('hide')
					//and that will cause angular event won't work.
					//so i modify the callback of bootbox's hidden.bs.modal event.
				if (!$scope.projForm){
					$scope.projForm = $('.prjDialog')
				}
					bootbox.dialog({
						/**
						 * @required String|Element
						 */
						message: $scope.projForm,
						title: "创建新项目",
						className: "prjDialog"
					});
					$('#dialog').show();


				console.log($scope.projForm)

			}
		$scope.saveProj = function(isValid) {
			console.log('saveProj',isValid)
			//return false;
			if (!isValid) {
				$('#subitProj').button('reset')
				return false;
			}
			//return;
			console.log($scope)
			console.log($scope.projName, $('#projList').val(), $scope.projInfo)
			Projs.save([$scope.projName, $('#projList').val(), $scope.projInfo, ''], function(result, data) {
				console.log(result, data)
				$('#subitProj').button('reset')
				if (result == 'success') {
					//wc.alert('项目创建成功')
					// bootbox.dialog({
					//   message: '项目创建成功'
					// })
					//  $(".prjDialog").modal('hide');
					wcData.projs[$scope.projName] = {
						name: $scope.projName,
						src: $('#projList').val(),
						info: $scope.projInfo,
						config: ''
					};
					var instance = $('#allProjs').jstree(true);
					var addNode = instance.create_node(instance.element[0].firstChild.firstChild, {
						text: $scope.projName
					});
					// instance.create_node(instance)

					bootbox.hideAll()
					console.log('hideAll')
						//must setTimeout after hideAll
					setTimeout(function() {
						bootbox.success('项目创建成功', function() {
							instance.select_node(addNode)
						})
					}, 500);

					//wc.bx.show('项目创建成功')
					console.log('项目创建成功')
						//$("#dialog").dialog("close");
				} else {
					console.log(result, data)
						//$('#subitProj').button('reset')
					return false;
				}

			})
		}



	});
