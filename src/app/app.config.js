(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider','$httpProvider',function($routeProvider,$locationProvider,$httpProvider){
$httpProvider.interceptors.push('HttpInterceptorService');
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/portfolio',{templateUrl:'src/app/portfolio/views/portfolio-view.html',controller:'PortfolioViewController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/views/analytics-dashboard.html',controller:'AnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$locationProvider.hashPrefix('!');
}]);
})();