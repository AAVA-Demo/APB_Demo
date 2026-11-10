(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/transactions',{templateUrl:'src/app/modules/transactions/views/transaction-view.html',controller:'TransactionViewController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/modules/analytics/views/analytics-dashboard.html',controller:'AnalyticsDashboardController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$locationProvider.hashPrefix('!');
}]);
})();