(function(){
'use strict';
angular.module('creditCardApp').constant('API_CONFIG',{baseUrl:'/api'}).config(['$routeProvider',function($routeProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.view.html',controller:'DashboardController',controllerAs:'vm'}).when('/transactions',{templateUrl:'src/app/modules/transactions/views/transactionlist.view.html',controller:'TransactionListController',controllerAs:'vm'}).when('/transactions/:id',{templateUrl:'src/app/modules/transactions/views/transactiondetail.view.html',controller:'TransactionDetailController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/modules/analytics/views/analytics.view.html',controller:'AnalyticsController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
}]);
})();