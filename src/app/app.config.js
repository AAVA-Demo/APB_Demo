(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.view.html',controller:'DashboardController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/card-management/card-list.view.html',controller:'CardListController',controllerAs:'vm'})
.when('/cards/:cardId',{templateUrl:'src/app/card-management/card-detail.view.html',controller:'CardDetailController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics.view.html',controller:'AnalyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]).constant('API_ENDPOINTS',{cards:'/api/cards',transactions:'/api/transactions',monthlyTransactions:'/api/transactions/monthly',userProfile:'/api/user/profile'}).constant('SPENDING_CATEGORIES',['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous']).run(['$rootScope','AuthService',function($rootScope,AuthService){
$rootScope.$on('$routeChangeStart',function(event,next,current){
if(!AuthService.isAuthenticated()){
AuthService.login();
}
});
}]);