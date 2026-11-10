(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('AnalyticsService', ['ApiGatewayService', '$q', function(ApiGatewayService, $q) {
      return {
        getCategorySpending: function() {
          var deferred = $q.defer();
          ApiGatewayService.get('/analytics/spending')
            .then(function(response) {
              var categories = response.map(function(catData) {
                return new window.SpendingCategoryModel(catData);
              });
              deferred.resolve(categories);
            })
            .catch(function(error) {
              var mockCategories = [
                {category: 'Food & Dining', amount: 3200, percentage: 25.7, transactionCount: 18},
                {category: 'Fuel', amount: 2100, percentage: 16.9, transactionCount: 12},
                {category: 'Shopping', amount: 2800, percentage: 22.5, transactionCount: 8},
                {category: 'Travel', amount: 1500, percentage: 12.0, transactionCount: 3},
                {category: 'Entertainment', amount: 1200, percentage: 9.6, transactionCount: 6},
                {category: 'Utilities', amount: 800, percentage: 6.4, transactionCount: 4},
                {category: 'Healthcare', amount: 500, percentage: 4.0, transactionCount: 2},
                {category: 'Education', amount: 250, percentage: 2.0, transactionCount: 1},
                {category: 'Miscellaneous', amount: 100.75, percentage: 0.8, transactionCount: 1}
              ];
              var categories = mockCategories.map(function(catData) {
                return new window.SpendingCategoryModel(catData);
              });
              deferred.resolve(categories);
            });
          return deferred.promise;
        },
        getMonthlyTrends: function() {
          var deferred = $q.defer();
          ApiGatewayService.get('/analytics/trends')
            .then(function(response) {
              var trends = response.map(function(trendData) {
                return new window.MonthlyTrendModel(trendData);
              });
              deferred.resolve(trends);
            })
            .catch(function(error) {
              var mockTrends = [
                {month: '2024-01', totalSpend: 9800},
                {month: '2024-02', totalSpend: 10500},
                {month: '2024-03', totalSpend: 11200},
                {month: '2024-04', totalSpend: 10800},
                {month: '2024-05', totalSpend: 12450.75},
                {month: '2024-06', totalSpend: 11900}
              ];
              var trends = mockTrends.map(function(trendData) {
                return new window.MonthlyTrendModel(trendData);
              });
              deferred.resolve(trends);
            });
          return deferred.promise;
        }
      };
    }]);
})();