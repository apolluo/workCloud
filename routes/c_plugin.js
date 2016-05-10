wc.app.controller('c_plugin', function($scope, wcData) {
  $scope.plugins = []
    //wc.plugin('all').run('list')
  function _loading() {
    bootbox.loading('加载中，请稍候...');
  }
  var listPlugins = $scope.listPlugins = function() {
    wc.plugin('all', _loading)
      .list()
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
        bootbox.hideAll();
        bootbox.danger(data)
          //wc.alert(data)
      })
  }
  $scope.install = function(name) {
    wc.plugin(name, _loading).install()
      .then(function() {
        console.log('安装结束')
      })
      .catch(function(err) {
        console.log('安装失败')
      })
  }
  $scope.uninstall = function(name) {
    wc.plugin('all', _loading).uninstall(name)
      .then(
        function() {
          //wc.alert('删除插件' + name + '成功')
          bootbox.hideAll();
          setTimeout(function() {
            bootbox.success('删除插件' + name + '成功');
          }, 500);
          listPlugins();
        }
      ).catch(
        function(err) {
          //wc.alert('删除插件' + name + '失败: ' + err)
          setTimeout(function() {
            bootbox.danger('删除插件' + name + '失败: ' + err);
          }, 500);
          listPlugins();
        }
      )
  }

  listPlugins();

})
