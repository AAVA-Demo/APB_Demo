angular.module('creditCardApp').config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
$routeProvider
.when('/dashboard',{templateUrl:'src/app/dashboard/dashboard.html',controller:'DashboardController',controllerAs:'vm'})
.when('/portfolio',{templateUrl:'src/app/portfolio/portfolio.html',controller:'PortfolioController',controllerAs:'vm'})
.when('/card-management',{templateUrl:'src/app/card-management/card-management.html',controller:'CardManagementController',controllerAs:'vm'})
.when('/analytics',{templateUrl:'src/app/analytics/analytics-dashboard.html',controller:'AnalyticsController',controllerAs:'vm'})
.when('/insights',{templateUrl:'src/app/insights/insights.html',controller:'InsightsController',controllerAs:'vm'})
.when('/kpi',{templateUrl:'src/app/kpi/kpi-dashboard.html',controller:'KPIController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
$httpProvider.interceptors.push('authInterceptor');
}]);
angular.module('creditCardApp').factory('authInterceptor',['$window','$q',function($window,$q){
return{
request:function(config){
var token=$window.sessionStorage.getItem('authToken');
if(token){
config.headers.Authorization='Bearer '+token;
}
return config;
},
responseError:function(rejection){
if(rejection.status===401){
$window.location.href='#/login';
}
return $q.reject(rejection);
}
};
}]);