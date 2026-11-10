(function(){
'use strict';
angular.module('creditCardApp',['ui.router','creditCard.dashboard','creditCard.transactions','creditCard.analytics']).config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
$urlRouterProvider.otherwise('/dashboard');
$stateProvider.state('dashboard',{url:'/dashboard',templateUrl:'src/app/modules/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).state('transactions',{url:'/transactions',templateUrl:'src/app/modules/transactions/transactions.html',controller:'TransactionController',controllerAs:'vm'}).state('analytics',{url:'/analytics',templateUrl:'src/app/modules/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'});
}]);
})();