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
