(function(){
'use strict';
angular.module('creditCardApp',['ui.router','creditCardDashboardModule','cardManagementModule']).config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
$urlRouterProvider.otherwise('/dashboard');
$stateProvider.state('dashboard',{url:'/dashboard',templateUrl:'src/app/modules/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'}).state('cards',{url:'/cards',templateUrl:'src/app/modules/card-management/card-management.html',controller:'CardManagementController',controllerAs:'vm'});
}]).constant('API_CONFIG',{baseUrl:'/api',endpoints:{cards:'/api/cards',transactions:'/api/transactions'}});
})();