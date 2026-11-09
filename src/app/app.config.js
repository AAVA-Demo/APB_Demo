(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/modules/analytics/views/analytics.html',controller:'AnalyticsController',controllerAs:'vm'}).when('/cards',{templateUrl:'src/app/modules/card-management/views/card-list.html',controller:'CardManagementController',controllerAs:'vm'}).when('/cards/:cardId',{templateUrl:'src/app/modules/card-management/views/card-detail.html',controller:'CardManagementController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
}]).constant('API_BASE_URL','/api');
})();