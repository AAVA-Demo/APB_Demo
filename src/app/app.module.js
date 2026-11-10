(function(){
'use strict';
angular.module('creditCardApp',['ngRoute','app.dashboard','app.cardManagement','app.analytics'])
.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/card-management/views/card-management.html',controller:'CardManagementController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/views/analytics-dashboard.html',controller:'AnalyticsDashboardController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]);
angular.module('app.dashboard',[]);
angular.module('app.cardManagement',[]);
angular.module('app.analytics',[]);
})();