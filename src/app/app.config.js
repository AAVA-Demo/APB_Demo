(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider.when('/dashboard',{templateUrl:'src/app/views/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).when('/cards',{templateUrl:'src/app/views/card-management/card-list.html',controller:'CardListController',controllerAs:'vm'}).when('/cards/:cardId',{templateUrl:'src/app/views/card-management/card-details.html',controller:'CardDetailsController',controllerAs:'vm'}).when('/analytics',{templateUrl:'src/app/views/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'}).otherwise({redirectTo:'/dashboard'});
$locationProvider.hashPrefix('!');
}]).constant('API_BASE_URL','/api').run(['$http','AuthInterceptor',function($http,AuthInterceptor){
$http.defaults.headers.common['Authorization']='Bearer mock-jwt-token';
}]);
})();