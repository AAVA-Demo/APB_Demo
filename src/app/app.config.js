(function() {
'use strict';
angular.module('creditCardApp')
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
$routeProvider
.when('/dashboard', {
templateUrl: 'src/app/modules/dashboard/views/dashboard.view.html',
controller: 'DashboardController',
controllerAs: 'vm'
})
.when('/cards', {
templateUrl: 'src/app/modules/multi-card/views/multi-card.view.html',
controller: 'MultiCardController',
controllerAs: 'vm'
})
.when('/analytics', {
templateUrl: 'src/app/modules/spending-analytics/views/analytics.view.html',
controller: 'AnalyticsViewController',
controllerAs: 'vm'
})
.otherwise({
redirectTo: '/dashboard'
});
$httpProvider.interceptors.push('AuthInterceptor');
}]);
})();