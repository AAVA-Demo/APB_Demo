(function(){
'use strict';
angular.module('creditCardApp').constant('API_CONFIG',{baseUrl:'https://api.creditcard.demo/v1',timeout:5000}).config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.view.html',controller:'DashboardController',controllerAs:'vm'}).when('/transactions',{templateUrl:'src/app/modules/transactions/views/transaction-list.view.html',controller:'TransactionListController',controllerAs:'vm'}).when('/transactions/:transactionId',{templateUrl:'src/app/modules/transactions/views/transaction-detail.view.html',controller:'TransactionDetailController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/modules/analytics/views/analytics.view.html',controller:'AnalyticsController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push('HttpInterceptor');
}]).factory('HttpInterceptor',['$q','$window','NotificationService',function($q,$window,NotificationService){
return{request:function(config){
var token=$window.sessionStorage.getItem('authToken');
if(token){config.headers.Authorization='Bearer '+token;}
return config;},responseError:function(rejection){
if(rejection.status===401){NotificationService.error('Authentication failed. Please login.');$window.location.href='#!/login';}else if(rejection.status===500){NotificationService.error('Server error. Please try again later.');}
return $q.reject(rejection);}};
}]).run(['$rootScope','AuthService',function($rootScope,AuthService){
$rootScope.$on('$routeChangeStart',function(event,next,current){
if(!AuthService.isAuthenticated()&&next.$$route&&next.$$route.originalPath!=='/login'){event.preventDefault();AuthService.mockLogin();}
});
}]);