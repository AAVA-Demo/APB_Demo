(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/portfolio',{templateUrl:'src/app/modules/portfolio/views/portfolio.html',controller:'PortfolioController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/modules/analytics/views/analytics.html',controller:'AnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]).constant('API_ENDPOINTS',{creditCards:'/api/cards',transactions:'/api/transactions',userProfile:'/api/user/profile',categories:'/api/categories'});
})();