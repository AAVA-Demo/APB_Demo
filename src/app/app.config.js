(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/views/dashboard.view.html',controller:'DashboardController',controllerAs:'vm'})
.when('/transactions',{templateUrl:'src/app/transactions/views/transaction-list.view.html',controller:'TransactionListController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/views/analytics-dashboard.view.html',controller:'AnalyticsDashboardController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push('authInterceptor');
}]).factory('authInterceptor',['$window','$q',function($window,$q){
return{
request:function(config){
var token=$window.sessionStorage.getItem('authToken');
if(token){config.headers.Authorization='Bearer '+token;}
return config;
},responseError:function(rejection){
if(rejection.status===401){$window.location.href='#!/login';}
return $q.reject(rejection);
}
};
}]);
})();