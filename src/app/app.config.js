(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/kpi-dashboard/kpi-dashboard.html',controller:'KPIDashboardController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/card-management/card-management.html',controller:'CardManagementController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/transaction-analytics/transaction-analytics.html',controller:'TransactionAnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$locationProvider.hashPrefix('!');
}]);
})();