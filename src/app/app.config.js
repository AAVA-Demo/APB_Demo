(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/modules/analytics/views/analytics.html',controller:'AnalyticsController',controllerAs:'vm'}).when('/trends',{templateUrl:'src/app/modules/trends/views/trends.html',controller:'TrendAnalysisController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push('ErrorInterceptor');
}]);
})();