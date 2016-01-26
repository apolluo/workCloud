/**
 * route controller
 * @type {[type]}
 */
global._$ = jQuery;

wc.extend({
    app: (function() {
      var app = angular.module('workCloud', ['ngRoute'])
      var Projs = require('./model/projs'),
        Config = require('./model/config'),
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
              .when('/main', {
                templateUrl: 'view/main.html',
                controller: 'mainCtrl'
              })
              .when('/load_proj_config', {
                templateUrl: 'view/load_proj_config.html',
                controller: 'load_proj_config_ctrl'
              })
              .when('/plugin', {
                templateUrl: 'view/plugin.html',
                controller: 'plugin_ctrl'
              })
              .otherwise({
                redirectTo: '/load_proj_config'
              });

          }]);
        },
        initController = function() {
          app.controller('mainCtrl', function($scope, wcData) {})

          //proj
          app.controller('getProjsCtrl', function($scope, wcData) {
            console.log('getProjsCtrl')
            $scope.read = function(files) {
              console.log(111)
              console.log(files)
            }

            // var createProj = function(prjData) {
            //   return console.log(prjData)
            //   Projs.save([prjData.projName, prjData.projList, prjData.projInfo, ''], function(result, data) {
            //     wc.alert('项目创建成功')
            //     console.log(data)
            //     $("#dialog").dialog("close");
            //   })
            // }
            $scope.createProj = function(projType) {
                console.log(projType)
                wc.alert({
                  id: 'dialog',
                  buttons: [{
                    text: "Ok",
                    click: function() {
                      var closeDialog = function() {
                        $(this).dialog("close");
                      }
                      //createProj($scope)
                      Projs.save([$scope.projName, $('#projList').val(), $scope.projInfo, ''], function(result, data) {
                        wc.alert('项目创建成功')
                        console.log(data)
                        $("#dialog").dialog("close");
                      })

                    }
                  }, {
                    text: "Cancel",
                    click: function() {
                      $(this).dialog("close");
                    }
                  }]
                })
              }
              // var loadProj = function(data) {
              //   console.log('loadProj')
              //   wc.setLocalData('current_proj', data)
              //   window.location.href = "#/load_proj_config"
              // }
            var loadProj = function(data) {
              console.log('loadProj')
                //获取所有项目
              Projs.getProj(null, function(r, data) {
                //wc.alert('获取所有项目成功')
                console.log(data)
                var _prjs = {
                  text: '本地项目',
                  "state": {
                    "opened": true
                  },
                  children: [

                  ]
                }

                $.each(data, function(k, v) {
                  _prjs.children[k] = {
                    text: v.src
                  }
                  console.log(k, v.src)
                })
                $('#allProjs').jstree({
                  'core': {
                    'data': [
                      _prjs
                    ]
                  }
                });
                //var _data = data;
                $('#allProjs').on("changed.jstree", function(e, data) {
                  if (data.selected.length) {
                    //var path = _data.text
                    var name = data.instance.get_node(data.selected[0]).text
                      //var pn = path + "\\" + name
                    loadProjConfig(name)
                    console.log('The selected node is: ' + name);
                  }
                })
              })
            }

            var loadProjConfig = function(data) {
              wc.setLocalData('current_proj', data)
              window.location.href = "#/load_proj_config"
              wcData.loadConfig(data)
            };

            if (wc.getLocalData('current_proj')) {
              wc.file.readDir(wc.getLocalData('current_proj'), showDir)
                //loadProjConfig(wc.getLocalData('current_proj'))
            }
            loadProj();
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

          app.controller('load_proj_config_ctrl', function($scope, wcData) {
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

            console.log('load_proj_config_ctrl')
            console.log('wcData')
            console.log(wcData)
            var loadConfig = wcData.loadConfig = function(proj) {
              Config.getConfig(proj, getConfigCallback);
            }
            loadConfig(proj)
              //Config.getConfig(proj, getConfigCallback);
            $scope.run = function(config) {
                wc.buildJs(config)
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
              } else if (configType == 'file') {
                $scope.showCMD = false;
                $scope.showConfigFile = true;
              } else {
                $scope.showCMD = false;
                $scope.showConfigFile = false;
              }
              //});
            }

            var saveCallBack = function() {
              console.log(wc.getLocalData('current_proj') + '的配置保存成功')
              $scope.$apply();
            }
            var configCallback = function() {
              console.log(wc.getLocalData('current_proj') + '的配置删除成功')
              $scope.$apply();
            }

            $scope.delete = function(id) {
              //return console.log(id)
              Config.delete(id, configCallback)
            }

            $scope.save = function(data) {
              console.log(Projs)
                //更新
              if (data) {
                return Config.update([
                  data.name, data.type, data.configFile, data.cmdStr, data.info, wc.getLocalData('current_proj'),
                  data.id
                ], saveCallBack)
              }
              //先保存项目
              // Projs.save([name, wc.getLocalData('current_proj'), '', ''], function() {
              //   console.log('项目保存成功')
              //   saveConfig();
              // })
              //console.log(configName)
              console.log(this.configName, $scope.configName)
              Config.save([
                $scope.configName, $scope.configType, $scope.configFile, $scope.configCmd, $scope.info,
                wc.getLocalData('current_proj')
              ], saveCallBack)

            }
          })

          app.controller('plugin_ctrl',function($scope,wcData){
            $scope.plugins=[]
            //wc.plugin('all').run('list')
            var listPlugins=$scope.listPlugins=function(){
              wc.plugin('all').list()
              .then(function(data){
                console.log('--plugins--')
                console.log(data)
                data=data.join(' ').match(/\S+@\d.*\d/g)
                console.log(data)
                $scope.plugins=$.map(data,function(v,i){
                  var _plugin=v.split('@')
                  return {
                    name:_plugin[0],
                    version:_plugin[1]
                  }
                })
                console.log($scope.plugins)
                $scope.$apply();
              })
              .catch(function(data){
                wc.alert(data)
              })
            }
            $scope.install=function(name){
              wc.plugin(name).install()
              .then(function(){
                console.log('安装结束')
              })
              .catch(function(err){
                console.log('安装失败')
              })
            }
            $scope.uninstall=function(name){
              wc.plugin('all').uninstall(name)
              .then(
                function(){
                  wc.alert('删除插件'+name+'成功')
                  listPlugins();
                }
              ).catch(
                function(err){
                  wc.alert('删除插件'+name+'失败: '+err)
                  listPlugins();
                }
              )
            }

            listPlugins();

          })
        },

        showDir = function(data) {
          console.log("showDir")
          console.log(data)
            //刷新
          if ($('#projs').children().length > 0) {
            $('#projs').jstree(true).settings.core.data = data
            $('#projs').jstree(true).refresh();
          } else { //初始化
            console.log($('#projs').jstree)
            $('#projs').jstree({
              'core': {
                'data': [
                  data
                ]
              }
            });
          }
          $('#projs').css('height', '100%')
            // var _data = data;
            // loadProj(data.text)
        }

      var init = function() {
        initData();
        initRoute();
        initController();

      }


      init();
      // return {
      //   init: init
      // }
    }())

  })
  // var Projs = require('./model/projs')
  // var Config = require('./model/config')
  // var gui = require('nw.gui');
  // var async = require('async');
  //
  // var app = angular.module('workCloud', ['ngRoute']);
  //
  // //配置路由
  // app.config(['$routeProvider', function($routeProvider) {
  //   //定义路由
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: 'view/main.html',
  //       controller: 'mainCtrl'
  //     })
  //     .when('/load_proj_config', {
  //       templateUrl: 'view/load_proj_config.html',
  //       controller: 'load_proj_config_ctrl'
  //     })
  //     .otherwise({
  //       redirectTo: '/'
  //     });
  //
  // }]);
  //
  // app.controller('mainCtrl', ['$scope', function($scope) {
  //
  // }])
  //
  // app.controller('getProjsCtrl', ['$scope', function($scope) {
  //   console.log('getProjsCtrl')
  //   $scope.read = function(files) {
  //     console.log(111)
  //     console.log(files)
  //   }
  //   $scope.createProj = function(projType) {
  //     console.log(projType)
  //     wc.alert({
  //       id: 'dialog',
  //       buttons: [{
  //         text: "Ok",
  //         click: function() {
  //           var closeDialog = function() {
  //             $(this).dialog("close");
  //           }
  //           Projs.save([$scope.projName, wc.getLocalData('current_proj'), $scope.projInfo, ''], function(result, data) {
  //             wc.alert('项目保存成功')
  //             console.log(data)
  //             $("#dialog").dialog("close");
  //           })
  //
  //         }
  //       }, {
  //         text: "Cancel",
  //         click: function() {
  //           $(this).dialog("close");
  //         }
  //       }]
  //     })
  //   }
  //   var loadProj = function(data) {
  //     console.log('loadProj')
  //     wc.setLocalData('current_proj', data)
  //     window.location.href = "#/load_proj_config"
  //   }
  //
  //   var showDir = function(data) {
  //     console.log("showDir")
  //     console.log(data)
  //       //刷新
  //     if ($('#projs').children().length > 0) {
  //       $('#projs').jstree(true).settings.core.data = data
  //       $('#projs').jstree(true).refresh();
  //     } else { //初始化
  //       $('#projs').jstree({
  //         'core': {
  //           'data': [
  //             data
  //           ]
  //         }
  //       });
  //     }
  //     $('#projs').css('height', '100%')
  //     var _data = data;
  //     $('#projs').on("changed.jstree", function(e, data) {
  //       if (data.selected.length) {
  //         var path = _data.text
  //         var name = data.instance.get_node(data.selected[0]).text
  //         var pn = path + "\\" + name
  //         loadProj(pn)
  //         console.log('The selected node is: ' + pn);
  //       }
  //     })
  //     loadProj(data.text)
  //   }
  //   if (wc.getLocalData('current_proj')) {
  //     myFile.readDir(wc.getLocalData('current_proj'), showDir)
  //   }
  //   document.querySelector('#projList').onchange = function(e) {
  //       // console.log(this.value)
  //       // $scope.projList=this.value
  //       // $scope.apply();
  //       var dirName = this.value;
  //       //目录没同步完，得不到数据
  //       //var data= myFile.readDir(dirName)
  //       myFile.readDir(dirName, showDir)
  //
  //     }
  //     //$( "#accordion" ).accordion();
  //
  //   //获取所有项目
  //   Projs.getProj(null, function(r, data) {
  //       wc.alert('获取所有项目成功')
  //       console.log(data)
  //       var _prjs = {
  //         text: '本地项目',
  //         children: [
  //
  //         ]
  //       }
  //
  //       $.each(data, function(k, v) {
  //         _prjs.children[k] = {
  //           text: v.src
  //         }
  //         console.log(k, v.src)
  //       })
  //       $('#allProjs').jstree({
  //         'core': {
  //           'data': [
  //             _prjs
  //           ]
  //         }
  //       });
  //     })
  //     //allProjs
  //
  // }])
  //
  // app.controller('load_proj_config_ctrl', ['$scope', function($scope) {
  //     var proj = $scope.proj = wc.getLocalData('current_proj');
  //     $scope.showCMD = false;
  //     $scope.showConfigFile = false;
  //     var getConfigCallback = function(result, data) {
  //       if (result == 'success') {
  //         console.log(data)
  //           //$scope.currentConfigName = data;
  //         $scope.allConfigs = data;
  //         //去掉数据不会更新
  //         $scope.$apply();
  //       }
  //     }
  //     console.log('load_proj_config_ctrl')
  //     Config.getConfig(proj, getConfigCallback);
  //     $scope.run = function(config) {
  //         wc.buildJs(config)
  //       }
  //       // $('#configType').on('change',function(){
  //       //   console.log(1)
  //       // })
  //       //ng-change不触发，估计在webkit环境无法触发
  //     $scope.selectConfig = function(configType) {
  //       //$scope.$apply(function() {
  //       console.log(1)
  //       console.log(configType)
  //       if (configType == 'cmd') {
  //         $scope.showCMD = true;
  //         $scope.showConfigFile = false;
  //       } else if (configType == 'file') {
  //         $scope.showCMD = false;
  //         $scope.showConfigFile = true;
  //       } else {
  //         $scope.showCMD = false;
  //         $scope.showConfigFile = false;
  //       }
  //       //});
  //     }
  //
  //     var saveCallBack = function() {
  //       console.log(wc.getLocalData('current_proj') + '的配置保存成功')
  //       $scope.$apply();
  //     }
  //     var configCallback = function() {
  //       console.log(wc.getLocalData('current_proj') + '的配置删除成功')
  //       $scope.$apply();
  //     }
  //
  //     $scope.delete = function(id) {
  //       //return console.log(id)
  //       Config.delete(id, configCallback)
  //     }
  //
  //     $scope.save = function(data) {
  //       console.log(Projs)
  //         //更新
  //       if (data) {
  //         return Config.update([
  //           data.name, data.type, data.configFile, data.cmdStr, data.info, wc.getLocalData('current_proj'),
  //           data.id
  //         ], saveCallBack)
  //       }
  //       //先保存项目
  //       // Projs.save([name, wc.getLocalData('current_proj'), '', ''], function() {
  //       //   console.log('项目保存成功')
  //       //   saveConfig();
  //       // })
  //       //console.log(configName)
  //       console.log(this.configName, $scope.configName)
  //       Config.save([
  //         $scope.configName, $scope.configType, $scope.configFile, $scope.configCmd, $scope.info,
  //         wc.getLocalData('current_proj')
  //       ], saveCallBack)
  //
  //     }
  //   }])
  //ready事件没用，必须写在控制器中
  // $(document).ready(function() {
  // 	document.querySelector('#projList').onchange=function(){
  // 		alert(2)
  // 	}
  // 	console.log($('input[name="projList"]'))
  // 	$('input[name="projList"]').change(function(){
  // 		alert(1)
  // 	})
  // })
