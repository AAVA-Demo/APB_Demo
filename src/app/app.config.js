(function(){
'use strict';
angular.module('creditCardApp').constant('API_CONFIG',{baseUrl:'https://api.creditcard.demo/v1',timeout:5000}).config(['$routeProvider',function($routeProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).when('/transactions',{templateUrl:'src/app/transactions/transaction-list.html',controller:'TransactionListController',controllerAs:'vm'}).when('/transactions/:id',{templateUrl:'src/app/transactions/transaction-detail.html',controller:'TransactionDetailController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
}]).config(['$httpProvider',function($httpProvider){
$httpProvider.interceptors.push(['$q','$window',function($q,$window){
return{request:function(config){const token=$window.sessionStorage.getItem('authToken');if(token){config.headers.Authorization='Bearer '+token;}
return config;},responseError:function(rejection){
if(rejection.status===401){$window.location.href='#/login';}
return $q.reject(rejection);}};
}]);
}]);
})();