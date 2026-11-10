(function(){
'use strict';
angular.module('creditCardApp').config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider){
$httpProvider.interceptors.push('AuthInterceptor');
$urlRouterProvider.otherwise('/dashboard');
$stateProvider.state('dashboard',{url:'/dashboard',templateUrl:'src/app/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).state('transactions',{url:'/transactions',templateUrl:'src/app/transactions/transaction-list.html',controller:'TransactionListController',controllerAs:'vm'}).state('transactionDetail',{url:'/transactions/:id',templateUrl:'src/app/transactions/transaction-detail.html',controller:'TransactionDetailController',controllerAs:'vm'}).state('analytics',{url:'/analytics',templateUrl:'src/app/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'});
}]).constant('API_ENDPOINTS',{cards:'/api/cards',transactions:'/api/transactions',categorySpending:'/api/analytics/category-spending',monthlyTrends:'/api/analytics/monthly-trends',cardWiseSpend:'/api/analytics/card-wise-spend'});
})();