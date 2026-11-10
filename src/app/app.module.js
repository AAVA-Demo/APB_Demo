(function(){
'use strict';
angular.module('creditCardApp',['ngRoute','dashboardModule','cardManagementModule','analyticsModule']).config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/modules/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm',resolve:{kpiData:['KPIService',function(KPIService){return KPIService.getKPIs();}]}}).when('/cards',{templateUrl:'src/app/modules/card-management/card-list.html',controller:'CardManagementController',controllerAs:'vm'}).when('/cards/:cardId',{templateUrl:'src/app/modules/card-management/card-detail.html',controller:'CardManagementController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/modules/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
$locationProvider.hashPrefix('!');
}]).run(['$rootScope','$location','AuthService',function($rootScope,$location,AuthService){
$rootScope.$on('$routeChangeStart',function(event,next,current){
if(!AuthService.isAuthenticated()&&next.$$route&&next.$$route.originalPath!=='/login'){
event.preventDefault();
AuthService.authenticate().then(function(){
$location.path(next.$$route.originalPath);});
}
});
}]);
})();