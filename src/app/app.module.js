(function(){
'use strict';
angular.module('creditCardApp',['ngRoute','ngAnimate','dashboardModule','spendingAnalyticsModule','trendAnalysisModule']).config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider.when('/',{redirectTo:'/dashboard'}).when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).when('/spending-analytics',{templateUrl:'src/app/modules/spending-analytics/views/spending-analytics.html',controller:'SpendingAnalyticsController',controllerAs:'vm'}).when('/trend-analysis',{templateUrl:'src/app/modules/trend-analysis/views/trend-analysis.html',controller:'TrendAnalysisController',controllerAs:'vm'}).otherwise({redirectTo:'/'});
}]).run(['AuthService','$location',function(AuthService,$location){
if(!AuthService.isAuthenticated()){
AuthService.autoLogin();
}
}]);
})();