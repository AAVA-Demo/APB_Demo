(function(){
'use strict';
angular.module('creditCardApp').config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$httpProvider.interceptors.push('authInterceptor');
$routeProvider
.when('/dashboard',{templateUrl:'src/app/modules/dashboard/views/dashboard.html',controller:'dashboardController',controllerAs:'vm'})
.when('/cards',{templateUrl:'src/app/modules/cardManagement/views/cardList.html',controller:'cardListController',controllerAs:'vm'})
.when('/cards/:cardId',{templateUrl:'src/app/modules/cardManagement/views/cardDetail.html',controller:'cardDetailController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/modules/analytics/views/analytics.html',controller:'analyticsController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
}]);
})();