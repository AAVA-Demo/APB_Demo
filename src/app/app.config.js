(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'dashboardController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/cardManagement/card-management.html',controller:'cardManagementController',controllerAs:'vm'})
.when('/cards/:cardId',{templateUrl:'src/app/cardManagement/card-details.html',controller:'cardManagementController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics.html',controller:'analyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]);
})();