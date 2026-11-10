(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$httpProvider.interceptors.push('authInterceptor');
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/card-management/card-list.html',controller:'CardListController',controllerAs:'vm'})
.when('/cards/:cardId',{templateUrl:'src/app/card-management/card-detail.html',controller:'CardDetailController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics.html',controller:'AnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]).constant('API_ENDPOINTS',{baseUrl:'https://api.creditcard.demo',cards:'/api/cards',userCards:'/api/user/cards',transactions:'/api/transactions',monthlyTransactions:'/api/transactions?month=current',cardWiseSpend:'/api/transactions/card'});
})();