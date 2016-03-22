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
                // $scope.read = function(files) {
                //   console.log(111)
                //   console.log(files)
                // }

              // var createProj = function(prjData) {
              //   return console.log(prjData)
              //   Projs.save([prjData.projName, prjData.projList, prjData.projInfo, ''], function(result, data) {
              //     wc.alert('项目创建成功')
              //     console.log(data)
              //     $("#dialog").dialog("close");
              //   })
              // }
              $scope.saveProj = function(isValid) {
                console.log('saveProj')
                console.log(isValid)
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
              $scope.createProj = function(projType) {
                  console.log(projType)
                    //要保存起来，不然会被bootbox删除
                  if (!$scope.projForm)
                    $scope.projForm = document.getElementById('dialog')
                  console.log($scope.projForm)
                  bootbox.dialog({
                    /**
                     * @required String|Element
                     */
                    message: $scope.projForm,

                    /**
                     * @optional String|Element
                     * adds a header to the dialog and places this text in an h4
                     */
                    title: "创建新项目",

                    /**
                     * @optional Function
                     * allows the user to dismisss the dialog by hitting ESC, which
                     * will invoke this function
                     */
                    onEscape: function() {},

                    /**
                     * @optional Boolean
                     * @default: true
                     * whether the dialog should be shown immediately
                     */
                    show: true,

                    /**
                     * @optional Boolean
                     * @default: true
                     * whether the dialog should be have a backdrop or not
                     */
                    backdrop: true,

                    /**
                     * @optional Boolean
                     * @default: true
                     * show a close button
                     */
                    closeButton: true,

                    /**
                     * @optional Boolean
                     * @default: true
                     * animate the dialog in and out (not supported in < IE 10)
                     */
                    animate: true,

                    /**
                     * @optional String
                     * @default: null
                     * an additional class to apply to the dialog wrapper
                     */
                    className: "prjDialog"
                  });
                  $('#dialog').show();
                  // wc.alert({
                  //   id: 'dialog'
                  //   // ,
                  //   // buttons: [{
                  //   //   text: "Ok",
                  //   //   click: function() {
                  //   //     $('#createProj').submit();
                  //   //     // var closeDialog = function() {
                  //   //     //     $(this).dialog("close");
                  //   //     //   }
                  //   //       //createProj($scope)
                  //   //     // Projs.save([$scope.projName, $('#projList').val(), $scope.projInfo, ''], function(result, data) {
                  //   //     //   wc.alert('项目创建成功')
                  //   //     //   console.log(data)
                  //   //     //   $("#dialog").dialog("close");
                  //   //     // })
                  //   //
                  //   //   }
                  //   // }, {
                  //   //   text: "Cancel",
                  //   //   click: function() {
                  //   //     $(this).dialog("close");
                  //   //   }
                  //   // }]
                  // })
                }
                // var loadProj = function(data) {
                //   console.log('loadProj')
                //   wc.setLocalData('current_proj', data)
                //   window.location.href = "#/load_proj_config"
                // }
              var loadProj = $scope.loadProj = function(name, isLoadConfig) {
                console.log('loadProj:' + name)
                if (name && name != 'all') {
                  console.log(wcData.projs[name])

                  // var closeDialog = function() {
                  //   $('.prjInfoDialog').modal("hide");
                  // }
                  if (isLoadConfig) {
                    return loadProjConfig(name);
                  }
                  $scope.targetProj=wcData.projs[name];
                  $scope.$apply();
                  setTimeout(function() {
                    if (!$scope.projInfoDialog) {
                      $scope.projInfoDialog = document.getElementById('projInfo')
                      $scope.projInfoDialog.style.display = 'block'
                    }
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
                          callback: function() {}
                        },
                        load: {
                          label: '加载',
                          className: 'btn-info',
                          callback: function() {
                            loadProjConfig(name, true)
                            bootbox.hideAll();
                            //closeDialog();
                          }
                        }
                      }
                    });
                    // wc.alert({
                    //   id: 'projInfo',
                    //   buttons: [{
                    //     text: "删除",
                    //     click: function() {
                    //       var closeDialog = function() {
                    //           $(this).dialog("close");
                    //         }
                    //         //createProj($scope)
                    //       Projs.delete(name, function(result, data) {
                    //         wc.alert('项目删除成功')
                    //
                    //         var instance = $('#allProjs').jstree(true);
                    //         instance.delete_node(instance.get_selected());
                    //         instance.refresh();
                    //         delete wcData.projs[name];
                    //         console.log(result, data)
                    //         $("#projInfo").dialog("close");
                    //       })
                    //
                    //     }
                    //   }, {
                    //     text: "修改",
                    //     click: function() {
                    //       $(this).dialog("close");
                    //     }
                    //   }, {
                    //     text: "加载",
                    //     click: function() {
                    //       $(this).dialog("close");
                    //     }
                    //   }]
                    // })
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
                  $scope.currentProj = wcData.projs[name]
                  $scope.$apply();
                  wc.setLocalData('current_proj', name);
                  var src = wcData.projs[name].src
                  wc.setLocalData('current_src', src)
                  window.location.href = "#/load_proj_config"
                  wc.file.readDir(src, showDir)
                  if (wcData.loadConfig)
                    wcData.loadConfig(name, src)
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
            // .directive('ferror', function($timeout) {
            //   console.log('ferror')
            //   return {
            //     restrict: 'EAC',
            //     scope: {
            //       field: '='
            //     },
            //     link: function(scope) {
            //       $timeout(function() {
            //         console.log(scope.field);
            //       });
            //       scope.$watch('field.$invalid', function() {
            //         console.log(scope.field);
            //       })
            //     }
            //   }
            // });

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
            var loadConfig = wcData.loadConfig = function(proj, src) {
              $scope.proj = wc.getLocalData('current_proj');
              Config.getConfig(proj, getConfigCallback);
            }
            loadConfig(proj)
              //Config.getConfig(proj, getConfigCallback);
            $scope.run = function(config) {
                if(config){
                  wc.buildJs(config)
                }else{
                  wc.buildJs({
                    name:$scope.configName,
                    type:$scope.configType,
                    cmdStr:$scope.configCmd,
                    configFile:$('#configFile').val(),
                    info:$scope.info
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
                    $scope.allConfigs.splice(index,1);
                    $scope.$apply();
                  }

                })
              }
              /**
               * delete config by id(default) or database field name
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
              }else{
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

          app.controller('plugin_ctrl', function($scope, wcData) {
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
        },

        showDir = function(data, id) {
          console.log("showDir")
          console.log(data)
          var _list = id || '#projs'
            //刷新
          if ($(_list).children().length > 0) {
            $(_list).jstree(true).settings.core.data = data
            $(_list).jstree(true).refresh();
          } else { //初始化
            console.log($(_list).jstree)
            $(_list).jstree({
              'core': {
                "check_callback": true,
                'data': [
                  data
                ]
              }
            });
          }
          $(_list).css('height', '100%')
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
