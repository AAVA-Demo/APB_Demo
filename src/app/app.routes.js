(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider',function($routeProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'dashboardController',controllerAs:'vm'})
.when('/portfolio',{templateUrl:'src/app/portfolio/portfolio.html',controller:'portfolioController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/card-management/card-list.html',controller:'cardListController',controllerAs:'vm'})
.when('/cards/:cardId',{templateUrl:'src/app/card-management/card-detail.html',controller:'cardDetailController',controllerAs:'vm'})
.when('/transactions',{templateUrl:'src/app/transactions/transaction-list.html',controller:'transactionListController',controllerAs:'vm'})
.when('/transactions/:transactionId',{templateUrl:'src/app/transactions/transaction-detail.html',controller:'transactionDetailController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics.html',controller:'analyticsController',controllerAs:'vm'})
.when('/insights',{templateUrl:'src/app/insights/insights.html',controller:'insightsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]);
})();