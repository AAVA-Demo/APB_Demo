(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', AnalyticsService);
  AnalyticsService.$inject = ['$http', '$q', 'AuthFactory', 'MockDataService'];
  function AnalyticsService($http, $q, AuthFactory, MockDataService) {
    this.getMonthlyTrends = function() {
      if (!AuthFactory.validateSession()) {
        return $q.reject('Unauthorized');
      }
      var deferred = $q.defer();
      try {
        var trends = MockDataService.getMonthlyTrends();
        deferred.resolve(trends);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    };
    this.getCategoryBreakdown = function() {
      if (!AuthFactory.validateSession()) {
        return $q.reject('Unauthorized');
      }
      var deferred = $q.defer();
      try {
        var categories = MockDataService.getCategoryBreakdown();
        deferred.resolve(categories);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    };
    this.getTransactions = function() {
      if (!AuthFactory.validateSession()) {
        return $q.reject('Unauthorized');
      }
      var deferred = $q.defer();
      try {
        var transactions = MockDataService.getTransactions();
        deferred.resolve(transactions);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    };
  }
})();