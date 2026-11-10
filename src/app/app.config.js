(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/transactions',{templateUrl:'src/app/transactions/transactions.html',controller:'TransactionController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push('HttpInterceptorService');
}]).run(['$rootScope','$location','AuthService',function($rootScope,$location,AuthService){
$rootScope.$on('$routeChangeStart',function(event,next,current){
if(!AuthService.isAuthenticated()){
AuthService.authenticate();
}
});
}]);
})();