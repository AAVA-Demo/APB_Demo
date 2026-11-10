(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$locationProvider.hashPrefix('!');
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/multi-card',{templateUrl:'src/app/multi-card/multi-card.html',controller:'MultiCardController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]);
})();