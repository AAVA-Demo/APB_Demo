(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CategoryService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = {
        getCategorySpending: getCategorySpending,
        getCategories: getCategories
      };
      return service;
      function getCategorySpending(filter) {
        var deferred = $q.defer();
        var params = {
          startDate: filter.startDate || getDefaultStartDate(),
          endDate: filter.endDate || getDefaultEndDate()
        };
        if (filter.selectedCategories && filter.selectedCategories.length > 0) {
          params.categories = filter.selectedCategories.join(',');
        }
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/category-spending', {
          params: params
        }).then(function(response) {
          var categoryData = response.data.map(function(cat) {
            return {
              category: cat.category,
              totalAmount: cat.totalAmount,
              transactionCount: cat.transactionCount,
              percentage: cat.percentage,
              monthYear: cat.monthYear
            };
          });
          deferred.resolve(categoryData);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
      function getCategories() {
        return ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      }
      function getDefaultStartDate() {
        var date = new Date();
        date.setMonth(date.getMonth() - 11);
        return date.toISOString().substring(0, 7);
      }
      function getDefaultEndDate() {
        return new Date().toISOString().substring(0, 7);
      }
    }]);
})();