(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsEngineFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      return {
        aggregateByCategory: function(transactions) {
          var deferred = $q.defer();
          setTimeout(function() {
            var categoryMap = {};
            var total = 0;
            transactions.forEach(function(t) {
              if (!categoryMap[t.category]) {
                categoryMap[t.category] = {category: t.category, totalAmount: 0, transactionCount: 0};
              }
              categoryMap[t.category].totalAmount += t.amount;
              categoryMap[t.category].transactionCount += 1;
              total += t.amount;
            });
            var categoryBreakdown = Object.keys(categoryMap).map(function(key) {
              var cat = categoryMap[key];
              cat.percentageOfTotal = total > 0 ? ((cat.totalAmount / total) * 100).toFixed(2) : 0;
              return cat;
            });
            var topCategory = categoryBreakdown.sort(function(a, b) { return b.totalAmount - a.totalAmount; })[0];
            deferred.resolve({data: {categoryBreakdown: categoryBreakdown, totalSpending: total, topCategory: topCategory ? topCategory.category : 'N/A'}});
          }, 300);
          return deferred.promise;
        }
      };
    }]);
})();