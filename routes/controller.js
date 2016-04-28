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
