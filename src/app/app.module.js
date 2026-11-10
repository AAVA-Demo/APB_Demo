(function(){
'use strict';
angular.module('creditCardApp',['ngRoute','ngTable'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/trends',{templateUrl:'src/app/spending-trends/trends-dashboard.html',controller:'TrendsController',controllerAs:'vm'})
.when('/category-analytics',{templateUrl:'src/app/category-analytics/category-analytics.html',controller:'CategoryAnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push(['$q','$window',function($q,$window){
return{
request:function(config){
var token=$window.sessionStorage.getItem('authToken');
if(token){
config.headers.Authorization='Bearer '+token;
}
return config;
},
responseError:function(rejection){
if(rejection.status===401){
$window.location.href='#!/login';
}
return $q.reject(rejection);
}
};
}]);
}])
.run(['$rootScope',function($rootScope){
$rootScope.appName='Credit Card Dashboard';
}]);
})();