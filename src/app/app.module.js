(function(){
'use strict';
angular.module('creditCardApp',['ui.router','dashboardModule','cardManagementModule','analyticsModule']).config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider){
$httpProvider.interceptors.push('AuthInterceptor');
$urlRouterProvider.otherwise('/dashboard');
$stateProvider.state('dashboard',{url:'/dashboard',templateUrl:'src/app/modules/dashboard/dashboard.view.html',controller:'DashboardController',controllerAs:'vm'}).state('cards',{url:'/cards',templateUrl:'src/app/modules/card-management/card-list.view.html',controller:'CardManagementController',controllerAs:'vm'}).state('cardDetail',{url:'/cards/:cardId',templateUrl:'src/app/modules/card-management/card-detail.view.html',controller:'CardManagementController',controllerAs:'vm'}).state('analytics',{url:'/analytics',templateUrl:'src/app/modules/analytics/analytics.view.html',controller:'AnalyticsController',controllerAs:'vm'});
}]).constant('API_CONFIG',{baseUrl:'https://api.creditcard.demo',endpoints:{cards:'/api/cards',transactions:'/api/transactions',users:'/api/users',categories:'/api/categories'}});
})();