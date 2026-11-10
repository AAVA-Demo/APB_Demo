(function() {
'use strict';
angular.module('creditCardApp')
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
$routeProvider
.when('/', {
redirectTo: '/dashboard'
})
.when('/dashboard', {
templateUrl: 'src/app/modules/dashboard/dashboard.html',
controller: 'DashboardController',
controllerAs: 'vm'
})
.when('/cards', {
templateUrl: 'src/app/modules/card-management/card-list.html',
controller: 'CardListController',
controllerAs: 'vm'
})
.when('/cards/:cardId', {
templateUrl: 'src/app/modules/card-management/card-detail.html',
controller: 'CardDetailController',
controllerAs: 'vm'
})
.when('/analytics', {
templateUrl: 'src/app/modules/analytics/analytics.html',
controller: 'AnalyticsController',
controllerAs: 'vm'
})
.otherwise({
redirectTo: '/dashboard'
});
}])
.run(['$http', function($http) {
$http.defaults.headers.common['Authorization'] = 'Bearer mock-token-12345';
}]);
})();