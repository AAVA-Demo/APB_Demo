(function() {
  'use strict';
  angular.module('portfolio', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/portfolio', {
          templateUrl: 'src/app/portfolio/views/portfolio-dashboard.html',
          controller: 'PortfolioDashboardController',
          controllerAs: 'vm'
        });
    }]);
})();