(function() {
  'use strict';
  angular.module('fraudAlertApp').config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/modules/fraud-detection/views/alert-dashboard.view.html',
        controller: 'alertDashboardController',
        controllerAs: 'vm'
      })
      .when('/alert/:alertId', {
        templateUrl: 'src/app/modules/notifications/views/alert-viewer.view.html',
        controller: 'alertViewerController',
        controllerAs: 'vm'
      })
      .when('/preferences', {
        templateUrl: 'src/app/modules/notifications/views/notification-preference.view.html',
        controller: 'notificationPreferenceController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
    $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
      return {
        request: function(config) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            const $state = $injector.get('$state');
            $state.go('login');
          }
          toastr.error(rejection.data && rejection.data.message || 'An error occurred', 'Error');
          return $q.reject(rejection);
        }
      };
    }]);
  }]);
})();