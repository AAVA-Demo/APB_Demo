(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/analytics/views/analytics.html',controller:'AnalyticsController',controllerAs:'vm'}).when('/transactions',{templateUrl:'src/app/transactions/views/transactions.html',controller:'TransactionController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
}]).constant('API_ENDPOINT','/api');
})();