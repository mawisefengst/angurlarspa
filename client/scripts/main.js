var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);

angular.module('sportSystemApp',['underscore','ngRoute'])
  //set router url and tremplates
  .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/:name', {
            templateUrl: function(attr){
              return '/templates/' + attr.name;
            }
        })
        .otherwise({redirectTo: '/home'});
    }])

  //init controller
	.controller('initCtrl',['$scope','menuFactory',function($scope,menuFactory){
    $scope.active = false;
    $scope.hasChildren = false;
    menuFactory.getMenu().success(function(menuData){
      $scope.parentMenuList = _.where(menuData,{parentID: -1});
      $scope.childrenMenuList = _.difference(menuData,$scope.parentMenuList);
    });
	}])

  .controller("ItemController",['$scope', function($scope){
      $scope.showNestedNav = false;
      $scope.showNestList = function(){
         $scope.showNestedNav = !$scope.showNestedNav;
      };

      $scope.closeNav = function(){
         $scope.$parent.$parent.active = false;
      };
  }])

  //factory to get menu from proxy, failed to load data directly due to 'Access-Control-Allow-Origin'
  .factory("menuFactory",["$http",function($http){
         var menuFactory = {
            getMenu: function(){
                var menuPromises = $http({
                    method : "GET",
                    url: "/service"
                });
                return menuPromises;
            }
         };
         return menuFactory;
    }])

  //directive to check finished event

  .directive("myRepeatDirective",function(){
    return{
      restrict : "A",
      scope: false,
      link: function($scope,$element,$attr){
         if($scope.menuChildren.parentID == $scope.menu.id) {
            $scope.$parent.$parent.$parent.hasChildren = true;
         }
      }
    }
  })

  //filter to remove space
  .filter('removeSpaces', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
    };
  }])

  /* Data will be fetched from service
  .value('menuData',[{'name':'Home','id':1,'parentID':-1},
    {'name':'Dashboard','id':2,'parentID':1},
    {'name':'Preview','id':3,'parentID':1},
    {'name':'Configuration','id':4,'parentID':1},
    {'name':'Reports','id':5,'parentID':-1},
    {'name':'All Applications','id':6,'parentID':5},
    {'name':'Help','id':7,'parentID':-1}])
  */
;