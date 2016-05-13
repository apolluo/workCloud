/**
 * route controller
 * @type {[type]}
 */
global._$=global.$ = jQuery;

wc.extend({
  app: (function() {
    var
			app = angular.module('workCloud', ['ngRoute']),
      initData = function() {
        console.log('initData')
        app.factory('wcData', function() {
          console.log('wcData')
          return {
            loadConfig: null
          }
        })
      },
      initRoute = function() {
        app.config(['$routeProvider', function($routeProvider) {
          //定义路由
          $routeProvider
            .when('/proj', {
              templateUrl: 'view/v_proj.html',
              controller: 'c_proj'
            })
            .when('/proj_add', {
              templateUrl: 'view/v_proj_add.html',
              controller: 'c_proj_add'
            })
            .when('/proj_config', {
              templateUrl: 'view/v_proj_config.html',
              controller: 'c_proj_config'
            })
            .when('/plugin', {
              templateUrl: 'view/v_plugin.html',
              controller: 'c_plugin'
            })
            .when('/settings', {
              templateUrl: 'view/v_settings.html',
              controller: 'c_settings'
            })
            .otherwise({
              redirectTo: '/proj_config'
            });

        }]);
      },
      initController = function() {
        app.controller('c_main', function($scope, wcData) {})
      },
      init = function() {
        initData();
        initRoute();
        initController();
      }

    init();
    // return {
    //   init: init
    // }
    return app;
  }())

});

// /**
//  * route controller
//  * @type {[type]}
//  */
//
// wc.app.controller('c_main', function($scope, wcData) {
//   console.log('c_main')
//   var
//     Projs = require('./model/projs'),
//     showDir = wc.showDir
//   $scope.createProj = function(projType) {
//     console.log(projType)
//     console.log($scope.projForm)
//       //bootbox will remove dialog, with event close、modal('hide')
//       //and that will cause angular event won't work.
//       //so i modify the callback of bootbox's hidden.bs.modal event.
//     if (!$scope.projForm) {
//       $scope.projForm = $('.prjDialog')
//       bootbox.dialog({
//         /**
//          * @required String|Element
//          */
//         message: $scope.projForm,
//         title: "创建新项目",
//         className: "prjDialog"
//       });
//       $('#dialog').show();
//     } else {
//       $('.prjDialog').modal('show')
//     }
//   }
//
//
//   // var loadProj = function(data) {
//   //   console.log('loadProj')
//   //   wc.setLocalData('current_proj', data)
//   //   window.location.href = "#/v_proj_config"
//   // }
//   var loadProj = $scope.loadProj = function(name, isLoadConfig) {
//     if (name && name == '本地项目') {
//       return;
//     }
//     console.log('loadProj:' + name)
//     if (name && name != 'all') {
//       console.log(wcData.projs[name])
//
//       // var closeDialog = function() {
//       //   $('.prjInfoDialog').modal("hide");
//       // }
//       if (isLoadConfig) {
//         return loadProjConfig(name);
//       }
//       $scope.targetProj = wcData.projs[name];
//       $scope.$apply();
//       setTimeout(function() {
//         if (!$scope.projInfoDialog) {
//           $scope.projInfoDialog = document.getElementById('projInfo')
//           $scope.projInfoDialog.style.display = 'block'
//         }
//         bootbox.dialog({
//           message: $scope.projInfoDialog,
//           title: "项目详情",
//           className: "prjInfoDialog",
//           buttons: {
//             delete: {
//               label: '删除',
//               className: 'btn-danger',
//               callback: function() {
//                 deleteProjConfig(name)
//                   //createProj($scope)
//                 Projs.delete(name, function(result, data) {
//                   //wc.bx.show('项目删除成功')
//                   bootbox.hideAll();
//                   setTimeout(function() {
//                     bootbox.success('项目删除成功')
//                   }, 500)
//                   var instance = $('#allProjs').jstree(true);
//                   instance.delete_node(instance.get_selected());
//                   //instance.refresh();
//                   delete wcData.projs[name];
//                   console.log(result, data)
//                     //closeDialog();
//                     //$("#projInfo").dialog("close");
//                 })
//               }
//             },
//             change: {
//               label: '修改',
//               className: 'btn-warning',
//               callback: function() {
//                 Projs.modify([
//                   $('#projInfo .name').val(),
//                   $('#projInfo .src').val(),
//                   $('#projInfo .info').val(),
//                   $scope.targetProj.name
//                 ], function(result, data) {
//                   bootbox.hideAll();
//                   if (result == 'success') {
//                     setTimeout(function() {
//                       bootbox.success('项目修改成功！', function() {
//                           console.log('项目修改成功！')
//                           loadProjConfig(name, true)
//                             //location.href="#/";
//                         })
//                         // var instance = $('#allProjs').jstree(true);
//                         // instance.refresh()
//                     }, 500)
//                   } else {
//                     setTimeout(function() {
//                       bootbox.danger('项目修改失败！')
//                     }, 500)
//                   }
//                   // delete wcData.projs[name];
//                   // console.log(result, data)
//                 })
//               }
//             },
//             load: {
//               label: '加载',
//               className: 'btn-info',
//               callback: function() {
//                 loadProjConfig(name, true)
//                 bootbox.hideAll();
//                 //closeDialog();
//               }
//             }
//           }
//         });
//       }, 500);
//       return;
//     }
//     console.log('get all proj')
//     var renderProjTree = function(data) {
//         //wc.alert('获取所有项目成功')
//         console.log(data)
//         wcData.projs = {}
//         var _prjs = {
//           text: '本地项目',
//           "state": {
//             "opened": true
//           },
//           children: [
//
//           ]
//         }
//
//         $.each(data, function(k, v) {
//           console.log('wcData.projs---------')
//           console.log(v)
//           wcData.projs[v.name] = v;
//           _prjs.children[k] = {
//             text: v.name
//           }
//           console.log(k, v.src)
//         })
//         showDir(_prjs, '#allProjs')
//           // $('#allProjs').jstree({
//           //   'core': {
//           //     'data': [
//           //       _prjs
//           //     ]
//           //   }
//           // });
//           //var _data = data;
//         $('#allProjs').on("changed.jstree", function(e, data) {
//           if (data.selected.length) {
//             //var path = _data.text
//             try {
//               var name = data.instance.get_node(data.selected[0]).text
//                 //var src = wcData.projs[name].src
//                 //var pn = path + "\\" + name
//               loadProj(name, false)
//                 //loadProjConfig(src)
//
//               console.log('The selected node is: ' + name);
//             } catch (e) {
//               console.log(e)
//             }
//
//           }
//         })
//       }
//       //获取所有项目
//     Projs.getProj(null, function(r, data) {
//       renderProjTree(data);
//       if (wc.getLocalData('current_proj')) {
//         loadProj(wc.getLocalData('current_proj'), true);
//         //wc.file.readDir(wc.getLocalData('current_src'), showDir)
//         //loadProjConfig(wc.getLocalData('current_proj'))
//       }
//     })
//   }
//
//   var loadProjConfig = function(name) {
//     if (name && wcData.projs[name]) {
//       $scope.currentProj = wcData.projs[name]
//       $scope.$apply();
//       wc.setLocalData('current_proj', name);
//       var src = wcData.projs[name].src
//       wc.setLocalData('current_src', src)
//         // window.location.href = "#/v_proj_config"
//       console.log('readDir:' + src)
//       wc.file.readDir(src, showDir)
//       if (wcData.loadConfig)
//         wcData.loadConfig(name, src)
//     }
//   };
//
//   var deleteProjConfig = function(name) {
//     if (name && wcData.projs[name]) {
//       if ($scope.currentProj == wcData.projs[name]) {
//         $scope.currentProj = null
//         wc.setLocalData('current_proj', '');
//         wc.setLocalData('current_src', '')
//         $scope.$apply();
//         window.location.href = "#/"
//       }
//       //wc.file.readDir(src, showDir)
//       if (wcData.deleteConfig) {
//         wcData.deleteConfig({
//           prj: name
//         })
//       }
//
//     }
//   }
//   loadProj('all');
//
//   $('#projList').change(function(e) {
//     // console.log(this.value)
//     // $scope.projList=this.value
//     // $scope.apply();
//     var dirName = this.value;
//     //目录没同步完，得不到数据
//     //var data= myFile.readDir(dirName)
//     //myFile.readDir(dirName, showDir)
//     wc.file.readDir(dirName, showDir)
//
//   })
//
// });

wc.app.controller('c_plugin', function($scope, wcData) {
	$scope.plugins = []
		//wc.plugin('all').run('list')
	var listPlugins = $scope.listPlugins = function() {
		wc.plugin('all',wc.loading).list()
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
				bootbox.hideAll();
				wc.scroll('ngview')
			})
			.catch(function(data) {
				bootbox.danger(data)
				//wc.alert(data)
			})
	}
	$scope.install = function(name) {
		wc.plugin(name,wc.loading).install()
			.then(function() {
				bootbox.hideAll();
				console.log('安装结束')
			})
			.catch(function(err) {
				console.log('安装失败')
			})
	}
	$scope.uninstall = function(name) {
		wc.plugin('all',wc.loading).uninstall(name)
			.then(
				function() {
					bootbox.hideAll();
					//wc.alert('删除插件' + name + '成功')
					setTimeout(function() {
						bootbox.success('删除插件' + name + '成功');
					},500);
					listPlugins();
				}
			).catch(
				function(err) {
					//wc.alert('删除插件' + name + '失败: ' + err)
					setTimeout(function() {
						bootbox.danger('删除插件' + name + '失败: ' + err);
					},500);
					listPlugins();
				}
			)
	}

	listPlugins();

});

/**
 * route controller
 * @type {[type]}
 */
(function c_proj() {
	var
		Projs = require('./model/projs')

	wc.app.controller('c_proj', function($scope, wcData) {
	  console.log('c_proj')
		var showDir = wc.showDir

	  $scope.createProj = function(projType) {
	    console.log(projType)
	    console.log($scope.projForm)
	      //bootbox will remove dialog, with event close、modal('hide')
	      //and that will cause angular event won't work.
	      //so i modify the callback of bootbox's hidden.bs.modal event.
	      // if (!$scope.projForm){
	      // 	$scope.projForm = $('.prjDialog')
	      // }
	      // 	bootbox.dialog({
	      // 		/**
	      // 		 * @required String|Element
	      // 		 */
	      // 		message: $scope.projForm,
	      // 		title: "创建新项目",
	      // 		className: "prjDialog"
	      // 	});
	      // 	$('#dialog').show();
	      //
	      // console.log($scope.projForm)
	    wc.modal.dialog({
	      id: 'newProj',
	      message: $('.prjDialog'),
	      title: "创建新项目",
	      className: "prjDialog"
	    })
	    $('.prjDialog').removeClass('hide');
	  }
	  $scope.saveProj = function(isValid) {
	    console.log('saveProj', isValid)
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
					wc.modal.hideAll();
					$('#createProjForm')[0].reset();
					$scope.projName='';
					$scope.projInfo='';
	        //bootbox.hideAll();
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
					bootbox.hideAll()
	        console.log('hideAll')
	          //must setTimeout after hideAll
	        setTimeout(function() {
	          bootbox.danger('项目创建失败')
	        }, 500);
	        console.log(result, data)
	          //$('#subitProj').button('reset')
	        return false;
	      }

	    })
	  }

	  // var loadProj = function(data) {
	  //   console.log('loadProj')
	  //   wc.setLocalData('current_proj', data)
	  //   window.location.href = "#/v_proj_config"
	  // }
	  var loadProj = $scope.loadProj = function(name, isLoadConfig) {
	    if (name && name == '本地项目') {
	      return;
	    }
	    console.log('loadProj:' + name)
	    if (name && name != 'all') {
	      console.log(wcData.projs[name])

	      // var closeDialog = function() {
	      //   $('.prjInfoDialog').modal("hide");
	      // }
	      if (isLoadConfig) {
	        return loadProjConfig(name);
	      }
	      $scope.targetProj = wcData.projs[name];
	      $scope.$apply();
				wc.modal.hideAll();
				var isCurrentProj=($scope.currentProj&&$scope.currentProj.name==name)?true:false;

	      setTimeout(function() {
	        if (!$scope.projInfoDialog) {
	          $scope.projInfoDialog = document.getElementById('projInfo')
	          $scope.projInfoDialog.style.display = 'block'
	        }
					//bootbox.hideAll();
	        bootbox.dialog({
	          message: $scope.projInfoDialog,
	          title: "项目详情",
	          className: "prjInfoDialog",
	          buttons: {
	            delete: {
	              label: '删除',
	              className: 'btn-danger',
	              callback: function() {
	                deleteProjConfig(name)
	                  //createProj($scope)
	                Projs.delete(name, function(result, data) {
	                  //wc.bx.show('项目删除成功')
	                  bootbox.hideAll();
	                  setTimeout(function() {
	                    bootbox.success('项目删除成功')
	                  }, 500)
	                  var instance = $('#allProjs').jstree(true);
	                  instance.delete_node(instance.get_selected());
	                  //instance.refresh();
	                  delete wcData.projs[name];
	                  console.log(result, data)
	                    //closeDialog();
	                    //$("#projInfo").dialog("close");
	                })
	              }
	            },
	            change: {
	              label: '修改',
	              className: 'btn-warning',
	              callback: function() {
	                Projs.modify([
	                  $('#projInfo .name').val(),
	                  $('#projInfo .src').val(),
	                  $('#projInfo .info').val(),
	                  $scope.targetProj.name
	                ], function(result, data) {
	                  bootbox.hideAll();
	                  if (result == 'success') {
	                    setTimeout(function() {
	                      bootbox.success('项目修改成功！', function() {
	                          console.log('项目修改成功！')
	                          loadProjConfig(name, true)
	                            //location.href="#/";
	                        })
	                        // var instance = $('#allProjs').jstree(true);
	                        // instance.refresh()
	                    }, 500)
	                  } else {
	                    setTimeout(function() {
	                      bootbox.danger('项目修改失败！')
	                    }, 500)
	                  }
	                  // delete wcData.projs[name];
	                  // console.log(result, data)
	                })
	              }
	            },
	            load: {
	              label: '加载',
	              className: isCurrentProj?'btn-info hide':'btn-info',
	              callback: function() {
									if(isCurrentProj){
										 bootbox.hideAll();
	                   setTimeout(function() {
		                    bootbox.success('该项目已经加载！')
		                  }, 500)
											return;
									}
	                loadProjConfig(name, true)
	                bootbox.hideAll();
	                //closeDialog();
	              }
	            }
	          }
	        });
					$('.src,.info').on('mouseover',function () {
				    var pen=$('<span class="glyphicon glyphicon-pencil"></span>')
				    $(this).after(pen);
				    $(this).on('mouseout',function () {
				      pen.remove()
				    })
				  })
	      }, 500);
	      return;
	    }
	    console.log('get all proj')
	    var renderProjTree = function(data) {
	        //wc.alert('获取所有项目成功')
	        console.log(data)
	        wcData.projs = {}
	        var _prjs = {
	          text: '本地项目',
	          "state": {
	            "opened": true
	          },
	          children: [

	          ]
	        }

	        $.each(data, function(k, v) {
	          console.log('wcData.projs---------')
	          console.log(v)
	          wcData.projs[v.name] = v;
	          _prjs.children[k] = {
	            text: v.name
	          }
	          console.log(k, v.src)
	        })
	        showDir(_prjs, '#allProjs')
	          // $('#allProjs').jstree({
	          //   'core': {
	          //     'data': [
	          //       _prjs
	          //     ]
	          //   }
	          // });
	          //var _data = data;
	        $('#allProjs').on("changed.jstree", function(e, data) {
	          if (data.selected.length) {
	            //var path = _data.text
	            try {
	              var name = data.instance.get_node(data.selected[0]).text
	                //var src = wcData.projs[name].src
	                //var pn = path + "\\" + name
	              loadProj(name, false)
	                //loadProjConfig(src)

	              console.log('The selected node is: ' + name);
	            } catch (e) {
	              console.log(e)
	            }

	          }
	        })
	      }
	      //获取所有项目
	    Projs.getProj(null, function(r, data) {
				console.log('---------all proj ----------')
				console.log(data)
	      renderProjTree(data);
	      if (wc.getLocalData('current_proj')) {
	        loadProj(wc.getLocalData('current_proj'), true);
	        //wc.file.readDir(wc.getLocalData('current_src'), showDir)
	        //loadProjConfig(wc.getLocalData('current_proj'))
	      }
	    })
	  }

	  var loadProjConfig = function(name) {
	    if (name && wcData.projs[name]) {
				$('.proj-config').slideUp()
	      $scope.currentProj = wcData.projs[name]
	      $scope.$apply();
	      wc.setLocalData('current_proj', name);
	      var src = wcData.projs[name].src
	      wc.setLocalData('current_src', src)
	        // window.location.href = "#/v_proj_config"
	      console.log('readDir:' + src)
	      wc.file.readDir(src, showDir)
	      if (wcData.loadConfig)
	        wcData.loadConfig(name, src)
				setTimeout(function() {
					$('.proj-config').slideDown();
				},500);
	    }
	  };

	  var deleteProjConfig = function(name) {
	    if (name && wcData.projs[name]) {
	      if ($scope.currentProj == wcData.projs[name]) {
	        $scope.currentProj = null
	        wc.setLocalData('current_proj', '');
	        wc.setLocalData('current_src', '')
	        $scope.$apply();
	        window.location.href = "#/"
	      }
	      //wc.file.readDir(src, showDir)
	      if (wcData.deleteConfig) {
	        wcData.deleteConfig({
	          prj: name
	        })
	      }
	    }
	  }
	  loadProj('all');

	  $('#projList').change(function(e) {
	    // console.log(this.value)
	    // $scope.projList=this.value
	    // $scope.apply();
	    var dirName = this.value;
	    //目录没同步完，得不到数据
	    //var data= myFile.readDir(dirName)
	    //myFile.readDir(dirName, showDir)
	    wc.file.readDir(dirName, showDir)
	  })
	})
	.directive('wcUniqueField', function() {
		return {
			require: 'ngModel',
			link: function(scope, ele, attrs, ctrl) {
				var checkTimer;
				scope.$watch(attrs.ngModel, function() {
					var name=scope[attrs.ngModel]
					if (!name) {
						return;
					}
					//ctrl.$setValidity('unique',null)
					console.log(attrs.wcUniqueField,scope[attrs.ngModel])
					if(checkTimer){
						clearTimeout(checkTimer);
					}
					checkTimer=setTimeout(function() {
						Projs.getProj(name,function (r,data) {
							console.log(r,data)
							if(r=='success'&&data){
								ctrl.$setValidity('unique',false)
							}else {
								ctrl.$setValidity('unique',true)
							}
							scope.$apply();
						})
					},500)

					// $http({
					//   method: 'POST',
					//   url: '/api/check/' + attrs.ensureUnique,
					//   data: {'field': attrs.ensureUnique}
					// }).success(function(data, status, headers, cfg) {
					//   c.$setValidity('unique', data.isUnique);
					// }).error(function(data, status, headers, cfg) {
					//   c.$setValidity('unique', false);
					// });
				});
			}
		}
	});
}());

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
        wc.buildJs(config, wc.log)
      } else {
        wc.buildJs({
          name: $scope.configName,
          type: $scope.configType,
          cmdStr: $scope.configCmd,
          configFile: $('#configFile').val(),
          info: $scope.info
        }, wc.log)
      }
    }
    // $('#configType').on('change',function(){
    //   console.log(1)
    // })
    //ng-change不触发，估计在webkit环境无法触发
  $scope.selectConfig = function(configType) {
    //$scope.$apply(function() {
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
    console.log(result, data)
    bootbox.success(wc.getLocalData('current_proj') + '的配置保存成功', function() {
      if ('update success' == result) {
        $scope.$apply();
      } else if ('success' == result) {
        $scope.allConfigs.push(data);
        $scope.$apply();
      }
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
});

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
